// Shared server-side AI caller. Keeps API keys off the client.
// Used by /api/analyze (the Solution Builder) and /api/chatbot.
//
// Providers are tried in order; if one fails (rate limit, outage) the next is used.
// All are free / open-source-model options:
//   1. GROQ_API_KEY       → Groq free tier (Llama 3.3 70B, very fast)  https://console.groq.com/keys
//   2. OPENROUTER_API_KEY → OpenRouter ":free" models                  https://openrouter.ai/keys
//   3. OPENAI_API_KEY     → OpenAI (paid, optional)
//   4. Pollinations       → keyless public endpoint (gpt-oss-20b), always available as a last resort

const SITE_URL = process.env.SITE_URL || "https://cookit.example";

function providers() {
  const list = [];
  if (process.env.GROQ_API_KEY) {
    list.push({
      name: "groq",
      apiKey: process.env.GROQ_API_KEY,
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      extraHeaders: {},
    });
  }
  if (process.env.OPENROUTER_API_KEY) {
    list.push({
      name: "openrouter",
      apiKey: process.env.OPENROUTER_API_KEY,
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
      extraHeaders: { "HTTP-Referer": SITE_URL, "X-Title": "CookIT" },
    });
  }
  if (process.env.OPENAI_API_KEY) {
    list.push({
      name: "openai",
      apiKey: process.env.OPENAI_API_KEY,
      url: "https://api.openai.com/v1/chat/completions",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      extraHeaders: {},
    });
  }
  if (process.env.DISABLE_KEYLESS_AI !== "true") {
    list.push({
      name: "pollinations",
      apiKey: null,
      url: "https://text.pollinations.ai/openai",
      model: "openai",
      extraHeaders: {},
    });
  }
  return list;
}

async function callProvider(provider, messages, { maxTokens, temperature }) {
  const headers = { "Content-Type": "application/json", ...provider.extraHeaders };
  if (provider.apiKey) headers.Authorization = `Bearer ${provider.apiKey}`;

  const r = await fetch(provider.url, {
    method: "POST",
    headers,
    body: JSON.stringify({ model: provider.model, messages, max_tokens: maxTokens, temperature }),
    signal: AbortSignal.timeout(25000),
  });

  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(`${provider.name} ${r.status}: ${body.slice(0, 300)}`);
  }
  const data = await r.json();
  const content = data?.choices?.[0]?.message?.content || "";
  if (!content.trim()) throw new Error(`${provider.name}: empty response`);
  return content;
}

/** Call the chat completions API and return the assistant text. Throws if every provider fails. */
export async function callAI(messages, { maxTokens = 700, temperature = 0.6 } = {}) {
  const list = providers();
  if (!list.length) throw new Error("No AI provider configured (set GROQ_API_KEY or OPENROUTER_API_KEY)");

  const errors = [];
  for (const provider of list) {
    try {
      return await callProvider(provider, messages, { maxTokens, temperature });
    } catch (err) {
      console.error(`[ai] ${err?.message || err}`);
      errors.push(err?.message || String(err));
    }
  }
  throw new Error(`All AI providers failed: ${errors.join(" | ")}`);
}

/** Best-effort extraction of a JSON object from a model response. Returns null on failure. */
export function extractJson(text) {
  if (!text) return null;
  // Strip code fences if present.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}
