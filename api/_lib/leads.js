// Shared helper: append a website lead to content/leads.json in the repo (private),
// so every form submission also lands in the admin Leads section. Best-effort —
// never throws, so it can't break the email-sending flow that calls it.

const GITHUB_API = "https://api.github.com";

export async function storeLead({ name, email, phone, service, message, source }) {
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPO) return; // not configured — skip quietly
  const branch = GITHUB_BRANCH || "main";
  const headers = { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" };
  const path = "content/leads.json";
  try {
    let list = [];
    let sha;
    const r = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/contents/${path}?ref=${branch}`, { headers });
    if (r.ok) {
      const d = await r.json();
      sha = d.sha;
      try { list = JSON.parse(Buffer.from(d.content, "base64").toString("utf-8")); } catch {}
      if (!Array.isArray(list)) list = [];
    }
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(name || "").trim().slice(0, 200),
      email: String(email || "").trim().slice(0, 200),
      phone: String(phone || "").trim().slice(0, 40),
      service: String(service || "").trim().slice(0, 120),
      message: String(message || "").trim().slice(0, 4000),
      source: String(source || "Website").trim().slice(0, 60),
      status: "new",
      submittedAt: new Date().toISOString(),
    };
    list.unshift(entry);
    const body = { message: `New lead: ${entry.name || entry.email}`, content: Buffer.from(JSON.stringify(list, null, 2)).toString("base64"), branch };
    if (sha) body.sha = sha;
    await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/contents/${path}`, { method: "PUT", headers, body: JSON.stringify(body) });
  } catch (e) {
    console.error("storeLead error:", e);
  }
}
