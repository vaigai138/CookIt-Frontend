import { sendEmail, emailLayout, fieldRow, messageBlock, handleCors, esc } from "./_lib/sendEmail.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Serialize the generated blueprint into a readable block for the notification email.
function blueprintToText(bp) {
  if (!bp) return "No blueprint generated.";
  const lines = [];
  if (bp.summary) lines.push(`Summary: ${bp.summary}`);
  if (bp.recommendations?.length) {
    lines.push("\nRecommended solutions:");
    bp.recommendations.forEach((r) => lines.push(`  • ${r.title}${r.why ? ` — ${r.why}` : ""}`));
  }
  if (bp.includes?.length) lines.push(`\nCould include:\n  • ${bp.includes.join("\n  • ")}`);
  if (bp.benefits?.length) lines.push(`\nExpected benefits:\n  • ${bp.benefits.join("\n  • ")}`);
  return lines.join("\n");
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    const { from_name, reply_to, phone_number, answers, blueprint } = req.body || {};
    if (!from_name || !reply_to) return res.status(400).json({ error: "Name and email are required" });
    if (!EMAIL_RE.test(reply_to)) return res.status(400).json({ error: "Please provide a valid email" });

    const a = answers || {};
    const html = emailLayout(
      "New Solution Builder Lead",
      "CookIT · AI Solution Builder",
      `<tr><td style="padding:0 40px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${fieldRow("Name", esc(from_name))}
          ${fieldRow("Email", `<a href="mailto:${esc(reply_to)}" style="color:#2563EB;text-decoration:none;">${esc(reply_to)}</a>`)}
          ${fieldRow("Phone", esc(phone_number) || "Not provided")}
          ${fieldRow("Industry", esc(a.industry) || "—")}
          ${fieldRow("Size", esc(a.size) || "—")}
          ${fieldRow("Goal", esc(a.goal) || "—", true)}
        </table>
      </td></tr>
      ${messageBlock("Challenges", esc(a.challenges) || "Not specified")}
      ${messageBlock("Current tools", esc(a.tools) || "Not specified")}
      ${messageBlock("AI-generated blueprint", esc(blueprintToText(blueprint)))}`
    );

    await sendEmail({
      subject: `Solution Builder Lead: ${from_name} — ${a.goal || a.industry || "General"}`,
      html,
      replyTo: reply_to,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("send-blueprint-lead error:", error);
    res.status(500).json({ error: "Failed to send" });
  }
}
