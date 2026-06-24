import { sendEmail, emailLayout, fieldRow, messageBlock, handleCors, esc } from "./_lib/sendEmail.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    const { from_name, reply_to, phone_number, interest, message } = req.body || {};
    if (!from_name || !reply_to) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const html = emailLayout(
      "New Chatbot Lead",
      "CookIT Assistant · Lead Capture",
      `<tr><td style="padding:0 40px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${fieldRow("Name", esc(from_name))}
          ${fieldRow("Email", `<a href="mailto:${esc(reply_to)}" style="color:#2563EB;text-decoration:none;">${esc(reply_to)}</a>`)}
          ${fieldRow("Phone", esc(phone_number) || "Not provided")}
          ${fieldRow("Interest", esc(interest) || "General Inquiry", true)}
        </table>
      </td></tr>
      ${message ? messageBlock("Details", esc(message)) : ""}`
    );

    await sendEmail({
      subject: `Chatbot Lead: ${from_name} — ${interest || "General"}`,
      html,
      replyTo: reply_to,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("send-chatbot-lead error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
