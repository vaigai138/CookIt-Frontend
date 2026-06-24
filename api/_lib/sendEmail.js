import nodemailer from "nodemailer";

// CookIT brand palette for transactional emails (matches the site theme).
const BRAND = {
  primary: "#2563EB",
  dark: "#0f172a",
  light: "#f1f5f9",
  accent: "#1d4ed8",
};

// Split a comma/semicolon list of addresses into a clean array.
function parseEmailList(raw) {
  if (!raw) return [];
  return raw
    .split(/[,;]/)
    .map((e) => e.trim())
    .filter(Boolean);
}

/**
 * Send a transactional email via Gmail SMTP (nodemailer).
 * Requires env: SMTP_USER, SMTP_PASS (Gmail App Password), RECIPIENT_EMAIL.
 * Optional: CC_EMAILS.
 */
export async function sendEmail({ subject, html, replyTo }) {
  const toList = parseEmailList(process.env.RECIPIENT_EMAIL);
  if (toList.length === 0) throw new Error("RECIPIENT_EMAIL is not configured");
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER / SMTP_PASS are not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"CookIT Website" <${process.env.SMTP_USER}>`,
    to: toList.join(", "),
    cc: process.env.CC_EMAILS || undefined,
    replyTo: replyTo || undefined,
    subject,
    html,
  });
}

/** Wrap body rows in a branded CookIT email layout. */
export function emailLayout(title, subtitle, bodyRows) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:${BRAND.light};font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.light};padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border-top:4px solid ${BRAND.primary};">
        <tr><td style="padding:28px 40px 16px;">
          <span style="font-size:24px;font-weight:800;color:${BRAND.primary};letter-spacing:-0.5px;">CookIT</span>
        </td></tr>
        <tr><td style="padding:0 40px 8px;">
          <h1 style="margin:0;font-size:22px;color:${BRAND.dark};font-weight:700;">${title}</h1>
          <p style="margin:6px 0 0;font-size:13px;color:${BRAND.accent};text-transform:uppercase;letter-spacing:1px;font-weight:600;">${subtitle}</p>
        </td></tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:14px 0 20px;"></td></tr>
        ${bodyRows}
        <tr><td style="padding:28px 40px;">
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 16px;">
          <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">CookIT &middot; Technology Solutions for Growing Businesses</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** A labelled field row for the email body table. */
export function fieldRow(label, value, isTag = false) {
  const valHtml = isTag
    ? `<span style="display:inline-block;background:${BRAND.primary};color:#fff;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:600;">${value}</span>`
    : `<span style="font-size:15px;color:${BRAND.dark};">${value}</span>`;
  return `<tr>
    <td style="padding:8px 0;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;width:130px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;">${valHtml}</td>
  </tr>`;
}

/** A highlighted message/quote block. */
export function messageBlock(label, content) {
  return `<tr><td style="padding:18px 40px 0;">
    <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">${label}</p>
    <div style="background:${BRAND.light};padding:16px 20px;border-radius:8px;font-size:14px;color:#334155;line-height:1.6;border-left:3px solid ${BRAND.primary};white-space:pre-line;">${content}</div>
  </td></tr>`;
}

/** Standard CORS preflight + method guard for POST handlers. Returns true if handled. */
export function handleCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return true;
  }
  return false;
}

/** Minimal HTML escaping for user-supplied values placed into email HTML. */
export function esc(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
