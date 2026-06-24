// /api/analyze — the Solution Builder brain.
// Takes a business's wizard answers and returns a HIGH-LEVEL "teaser blueprint":
// recommended solution types, common modules, and expected benefits.
// It deliberately WITHHOLDS the detailed plan, architecture, tech stack, timeline,
// and pricing — those are the reason to contact CookIT for a full proposal.

import { callAI, extractJson } from "./_lib/ai.js";

const SYSTEM = `You are CookIT's Solution Advisor. CookIT is a technology company that builds business websites, custom software (CRM, inventory, dashboards, internal tools), mobile apps, and AI & automation.

A potential customer has described their business. Produce a HIGH-LEVEL, encouraging teaser blueprint that shows you understand their needs and points them toward the right type of solution.

STRICT RULES:
- Keep everything COMMON and high-level. Do NOT give a detailed implementation plan, system architecture, specific technologies/frameworks, database design, step-by-step roadmap, effort estimates, timelines, or pricing. Those are intentionally reserved for CookIT's full proposal after they get in touch.
- Recommend solution types from CookIT's offerings, not a full spec.
- Be concrete enough to feel valuable, vague enough that they need CookIT to actually build it.
- Stay positive, professional, and concise.

Respond with ONLY a JSON object in exactly this shape (no extra text):
{
  "summary": "2-3 sentence read-back of their situation and the opportunity",
  "recommendations": [ { "title": "Solution type", "why": "one line on why it fits" } ],
  "includes": [ "high-level module or capability", "..." ],
  "benefits": [ "expected business benefit", "..." ]
}
Provide 2-4 recommendations, 3-6 includes, and 2-4 benefits.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { industry, size, challenges, tools, goal } = req.body || {};
  if (!industry && !goal && !challenges) {
    return res.status(400).json({ error: "Please provide at least some business details" });
  }

  const userPrompt = `Business details:
- Industry: ${industry || "Not specified"}
- Business size: ${size || "Not specified"}
- Main challenges: ${challenges || "Not specified"}
- Current tools: ${tools || "Not specified"}
- Primary goal: ${goal || "Not specified"}

Generate the teaser blueprint JSON now.`;

  try {
    const text = await callAI(
      [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
      { maxTokens: 700, temperature: 0.6 }
    );

    const parsed = extractJson(text);
    if (parsed && parsed.summary) {
      return res.status(200).json({ blueprint: parsed });
    }
    // Fallback: return the raw text so the UI can still show something useful.
    return res.status(200).json({ blueprint: { summary: text.trim().slice(0, 800), recommendations: [], includes: [], benefits: [] } });
  } catch (err) {
    console.error("analyze error:", err?.message || err);
    return res.status(502).json({ error: "Couldn't generate a blueprint right now. Please try again or contact us." });
  }
}
