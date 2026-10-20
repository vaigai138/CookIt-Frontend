// /api/chatbot — server-side proxy for chat completions.
// Keeps API keys server-side so they never reach the browser.
// Provider selection + fallback lives in ./_lib/ai.js (Groq → OpenRouter → OpenAI → keyless Pollinations).

import { callAI } from "./_lib/ai.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Body must include a non-empty messages array" });
  }

  // Cap conversation length defensively.
  const trimmed = messages.slice(-25);

  try {
    const content = await callAI(trimmed, { maxTokens: 500, temperature: 0.7 });
    return res.status(200).json({ content });
  } catch (err) {
    console.error("[chatbot]", err?.message || err);
    return res.status(502).json({ error: "AI is temporarily unavailable" });
  }
}
