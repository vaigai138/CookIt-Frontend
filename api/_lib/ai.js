// Shared server-side AI caller. Keeps the OpenRouter/OpenAI key off the client.
// Used by /api/analyze (the Solution Builder). The chatbot has its own inline copy.

const DEFAULT_OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const SITE_URL = process.env.SITE_URL || "https://cookit.example";

function selectProvider() {
  if (process.env.OPENROUTER_API_KEY) {
    return {
      apiKey: process.env.OPENROUTER_API_KEY,
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
      extraHeaders: { "HTTP-Referer": SITE_URL, "X-Title": "CookIT" },
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      apiKey: process.env.OPENAI_API_KEY,
      url: "https://api.openai.com/v1/chat/completions",
      model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
      extraHeaders: {},
    };
  }
  return null;
}

/** Call the chat completions API and return the assistant text. Throws on failure. */
export async function callAI(messages, { maxTokens = 700, temperature = 0.6 } = {}) {
  const provider = selectProvider();
  if (!provider) throw new Error("No AI provider configured (set OPENROUTER_API_KEY)");

  const r = await fetch(provider.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
      ...provider.extraHeaders,
    },
    body: JSON.stringify({ model: provider.model, messages, max_tokens: maxTokens, temperature }),
  });

  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(`AI upstream ${r.status}: ${body.slice(0, 300)}`);
  }
  const data = await r.json();
  return data?.choices?.[0]?.message?.content || "";
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
