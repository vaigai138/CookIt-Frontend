/* Instagram comment → DM automation webhook (CookIT — @cookinfo.tech only).

   Flow:
   1) Meta sends a webhook POST whenever someone comments on the reels/posts.
   2) We verify the signature, find which reel the comment is on, map it to a
      Post (public/content/posts.json), and check the Post's keywords.
   3) If a keyword matches, we send the commenter a private-reply DM with a
      button to the post page (kvmediaworks-style) — like SuperProfile/ManyChat.

   Callback URL registered in Meta:  https://cookinfo.tech/api/ig-webhook
   Env vars used:
     IG_WEBHOOK_VERIFY_TOKEN  — must match the "Verify token" in Meta's webhook config
     IG_ACCESS_TOKEN          — long-lived Instagram access token (fallback; the
                                auto-refreshed token in the repo takes priority)
     IG_APP_SECRET            — used to verify Meta's webhook signature
     IG_USER_ID               — the Instagram account id(s), comma-separated
     GITHUB_TOKEN / GITHUB_REPO / GITHUB_BRANCH — to read the auto-refreshed token
*/

import crypto from "crypto";

const SITE_URL = "https://cookinfo.tech";
const GRAPH = "https://graph.instagram.com/v21.0";
const DEFAULT_FOLLOW = "Follow @cookinfo.tech for more!";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // ── 1) Verification handshake (Meta calls this once when you add the URL) ──
  if (req.method === "GET") {
    const VERIFY = process.env.IG_WEBHOOK_VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && VERIFY && token === VERIFY) return res.status(200).send(challenge);
    return res.status(403).send("Forbidden");
  }

  // ── 2) Event delivery ──
  if (req.method === "POST") {
    let raw = "";
    let rawAuthentic = false;
    try { raw = await readRawBody(req); if (raw) rawAuthentic = true; } catch {}
    if (!raw && req.body) raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    const secret = process.env.IG_APP_SECRET;
    const sig = req.headers["x-hub-signature-256"];
    if (secret && sig && rawAuthentic && !validSignature(raw, sig, secret)) {
      console.warn("IG webhook: bad signature");
      return res.status(401).send("Invalid signature");
    }

    let body;
    try { body = JSON.parse(raw || "{}"); } catch { return res.status(200).send("EVENT_RECEIVED"); }

    try { await processEvent(body); }
    catch (e) { console.error("IG webhook processing error:", e); }
    return res.status(200).send("EVENT_RECEIVED");
  }

  return res.status(405).send("Method Not Allowed");
}

async function processEvent(body) {
  if (!body || body.object !== "instagram") return;
  const token = await loadToken();
  if (!token) { console.error("IG webhook: no access token"); return; }
  const myIds = new Set(String(process.env.IG_USER_ID || "").split(",").map((s) => s.trim()).filter(Boolean));

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== "comments") continue;
      const v = change.value || {};
      const commentId = v.id;
      const text = v.text || "";
      const mediaId = v.media && v.media.id;
      const fromId = v.from && v.from.id;
      if (!commentId || !mediaId) continue;
      if (fromId && myIds.has(String(fromId))) continue; // skip our own comments

      const post = await matchPost(mediaId, token);
      if (!post) continue;
      if (post.autoEnabled === false) continue;
      const keywords = Array.isArray(post.keywords) ? post.keywords.filter(Boolean) : [];
      if (keywords.length === 0) continue;

      const t = text.toLowerCase();
      const matched = keywords.some((k) => t.includes(String(k).toLowerCase()));
      if (!matched) continue;

      const sent = await sendDm(commentId, post, token);
      if (sent && post.publicReply !== false) {
        await replyToComment(commentId, pickReply(post), token);
      }
      console.log(`IG automation: post=${post.id} keyword-hit, DM sent=${sent}`);
    }
  }
}

async function matchPost(mediaId, token) {
  const posts = await fetchPosts();
  if (!posts.length) return null;
  const shortcode = await mediaShortcode(mediaId, token);
  if (!shortcode) return null;
  return posts.find(
    (p) => p.status === "published" && instaShortcode(p.instaLink) === shortcode
  ) || null;
}

async function mediaShortcode(mediaId, token) {
  try {
    const r = await fetch(`${GRAPH}/${mediaId}?fields=permalink&access_token=${encodeURIComponent(token)}`);
    if (!r.ok) return "";
    const d = await r.json();
    return instaShortcode(d.permalink || "");
  } catch { return ""; }
}

// Human-sounding public replies, used when a post doesn't define its own.
const DEFAULT_REPLIES = [
  "Thanks for commenting! Just sent it to your DMs 📩",
  "Check your DMs — sent it over! 💌",
  "Done ✅ Sent you a DM!",
  "Just slid into your DMs with it 🚀",
];

function pickReply(post) {
  const custom = (Array.isArray(post.commentReplies) ? post.commentReplies : [])
    .map((s) => String(s).trim()).filter(Boolean);
  const pool = custom.length ? custom : DEFAULT_REPLIES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Always send people to our own post page (where the real buttons/links live),
// never the raw asset URLs — keeps the website traffic.
async function sendDm(commentId, post, token) {
  const postUrl = `${SITE_URL}/posts/${post.id}`;
  const title = clamp((post.dmMessage && post.dmMessage.trim()) || "Here's your link 🎁", 80);
  const subtitle = clamp((post.followText && post.followText.trim()) || DEFAULT_FOLLOW, 80);
  const btnLabel = clamp((post.dmButtonLabel && post.dmButtonLabel.trim()) || "Open the link", 20);

  const ok = await sendMessage(commentId, {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [{ title, subtitle, buttons: [{ type: "web_url", url: postUrl, title: btnLabel }] }],
      },
    },
  }, token);
  if (ok) return true;

  const msg = (post.dmMessage && post.dmMessage.trim()) || "Here you go! 👇";
  const follow = (post.followText && post.followText.trim()) || DEFAULT_FOLLOW;
  return sendMessage(commentId, { text: `${msg}\n\n${follow}\n\n${postUrl}` }, token);
}

async function sendMessage(commentId, message, token) {
  try {
    const r = await fetch(`${GRAPH}/me/messages?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient: { comment_id: commentId }, message }),
    });
    if (!r.ok) { console.error("sendMessage failed", r.status, await safeText(r)); return false; }
    return true;
  } catch (e) { console.error("sendMessage error", e); return false; }
}

async function replyToComment(commentId, message, token) {
  try {
    const r = await fetch(`${GRAPH}/${commentId}/replies?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!r.ok) console.error("replyToComment failed", r.status, await safeText(r));
  } catch (e) { console.error("replyToComment error", e); }
}

function clamp(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + "…" : s; }

async function fetchPosts() {
  try {
    const r = await fetch(`${SITE_URL}/content/posts.json`, { cache: "no-store" });
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d.posts) ? d.posts : [];
  } catch { return []; }
}

async function loadToken() {
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH } = process.env;
  if (GITHUB_TOKEN && GITHUB_REPO) {
    try {
      const r = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/content/secrets/ig-token.json?ref=${GITHUB_BRANCH || "main"}`,
        { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
      );
      if (r.ok) {
        const d = await r.json();
        const j = JSON.parse(Buffer.from(d.content, "base64").toString("utf-8"));
        if (j && j.access_token) return j.access_token;
      }
    } catch {}
  }
  return process.env.IG_ACCESS_TOKEN || "";
}

function instaShortcode(url) {
  const m = String(url || "").match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
  return m ? m[1] : "";
}

function validSignature(raw, header, secret) {
  try {
    const expected = "sha256=" + crypto.createHmac("sha256", secret).update(raw, "utf8").digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(header);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch { return false; }
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function safeText(r) { try { return await r.text(); } catch { return ""; } }
