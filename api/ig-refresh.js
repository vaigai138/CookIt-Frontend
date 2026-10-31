/* Instagram long-lived token auto-refresh (CookIT).

   Instagram long-lived tokens last ~60 days. This endpoint refreshes the token
   (each refresh extends it another 60 days) and stores the new value in the repo
   at content/secrets/ig-token.json, which the webhook reads first. A daily Vercel
   cron (see vercel.json) calls it, so the token never expires.

   Manual run:  https://cookinfo.tech/api/ig-refresh?key=<CRON_SECRET>
   Env vars:    IG_ACCESS_TOKEN (seed/fallback), GITHUB_TOKEN/REPO/BRANCH, CRON_SECRET (optional). */

const GITHUB_API = "https://api.github.com";
const TOKEN_PATH = "content/secrets/ig-token.json";

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.authorization || "";
    const key = req.query.key;
    if (auth !== `Bearer ${secret}` && key !== secret) return res.status(401).send("Unauthorized");
  }

  const current = await loadToken();
  if (!current) return res.status(400).json({ error: "No token to refresh (set IG_ACCESS_TOKEN)" });

  let d;
  try {
    const r = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(current)}`
    );
    d = await r.json();
    if (!r.ok || !d.access_token) return res.status(500).json({ error: "Refresh failed", detail: d });
  } catch (e) {
    return res.status(500).json({ error: "Refresh request error", detail: String(e) });
  }

  try {
    await saveToken(d.access_token, d.expires_in);
  } catch (e) {
    return res.status(500).json({ error: "Could not store refreshed token", detail: String(e) });
  }

  return res.status(200).json({ ok: true, expires_in_days: Math.round((d.expires_in || 0) / 86400) });
}

async function loadToken() {
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH } = process.env;
  if (GITHUB_TOKEN && GITHUB_REPO) {
    try {
      const r = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/contents/${TOKEN_PATH}?ref=${GITHUB_BRANCH || "main"}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
      });
      if (r.ok) {
        const d = await r.json();
        const j = JSON.parse(Buffer.from(d.content, "base64").toString("utf-8"));
        if (j && j.access_token) return j.access_token;
      }
    } catch {}
  }
  return process.env.IG_ACCESS_TOKEN || "";
}

async function saveToken(accessToken, expiresIn) {
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPO) throw new Error("GitHub env not configured");
  let sha;
  try {
    const g = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/contents/${TOKEN_PATH}?ref=${GITHUB_BRANCH || "main"}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    });
    if (g.ok) sha = (await g.json()).sha;
  } catch {}

  const content = JSON.stringify(
    { access_token: accessToken, expires_in: expiresIn, refreshed_at: new Date().toISOString() },
    null, 2
  );
  const body = {
    message: "Refresh Instagram access token",
    content: Buffer.from(content).toString("base64"),
    branch: GITHUB_BRANCH || "main",
  };
  if (sha) body.sha = sha;

  const r = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/contents/${TOKEN_PATH}`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`GitHub PUT ${r.status}`);
}
