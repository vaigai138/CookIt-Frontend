// /api/chatbot — server-side proxy for chat completions.
// Keeps the OpenRouter (or OpenAI) API key server-side so it never reaches the browser.
//
// Env var priority:
//   1. OPENROUTER_API_KEY → https://openrouter.ai (model from OPENROUTER_MODEL, default a free model)
//   2. OPENAI_API_KEY     → https://api.openai.com (model from OPENAI_MODEL, default gpt-4o-mini)

const DEFAULT_OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

// Public site origin for OpenRouter attribution headers. Update when the domain is final.
const SITE_URL = process.env.SITE_URL || "https://cookit.example";
const SITE_NAME = "CookIT";

function selectProvider() {
  if (process.env.OPENROUTER_API_KEY) {
    return {
      name: "openrouter",
      apiKey: process.env.OPENROUTER_API_KEY,
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
      extraHeaders: { "HTTP-Referer": SITE_URL, "X-Title": SITE_NAME },
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      name: "openai",
      apiKey: process.env.OPENAI_API_KEY,
      url: "https://api.openai.com/v1/chat/completions",
      model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
      extraHeaders: {},
    };
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const provider = selectProvider();
  if (!provider) {
    console.error("[chatbot] No provider env var set (OPENROUTER_API_KEY or OPENAI_API_KEY).");
    return res.status(500).json({ error: "Server misconfigured: set OPENROUTER_API_KEY in Vercel env" });
  }

  const { messages, model: modelOverride } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Body must include a non-empty messages array" });
  }

  // Cap conversation length defensively.
  const trimmed = messages.slice(-25);
  const model = modelOverride || provider.model;

  try {
    const upstream = await fetch(provider.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
        ...provider.extraHeaders,
      },
      body: JSON.stringify({ model, messages: trimmed, max_tokens: 500, temperature: 0.7 }),
    });

    if (!upstream.ok) {
      let body = "";
      try { body = await upstream.text(); } catch {}
      console.error(`[chatbot] ${provider.name} error`, { status: upstream.status, model, body: body.slice(0, 400) });
      return res.status(upstream.status).json({
        error: `${provider.name} upstream error`,
        provider: provider.name,
        status: upstream.status,
        statusText: upstream.statusText,
        body,
        model,
      });
    }

    const data = await upstream.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return res.status(200).json({ content, model, provider: provider.name });
  } catch (err) {
    console.error(`[chatbot] Network error calling ${provider.name}:`, err?.message || err);
    return res.status(502).json({ error: "Upstream network error", message: err?.message || String(err) });
  }
}
