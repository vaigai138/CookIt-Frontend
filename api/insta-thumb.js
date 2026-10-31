/* Instagram thumbnail proxy for Posts.
   Instagram no longer allows unauthenticated thumbnail URLs, but it DOES serve an
   og:image to link-preview crawlers. We fetch the reel page as such a crawler,
   read og:image, then stream the image bytes back (so our <img> always works and
   the CDN's signed/expiring URL is never exposed). Cached at the edge for a day.

   Usage: /api/insta-thumb?c=<shortcode>  or  /api/insta-thumb?u=<insta url> */

const UA_CRAWLER = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";
const UA_BROWSER = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function shortcode(req) {
  const c = String(req.query.c || "").trim();
  if (/^[A-Za-z0-9_-]+$/.test(c)) return c;
  const m = String(req.query.u || "").match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
  return m ? m[1] : "";
}

const decode = (s) => (s || "")
  .replace(/\\u0026/g, "&")
  .replace(/&amp;/g, "&")
  .replace(/\\u([\dA-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\\//g, "/");

async function findOgImage(code) {
  for (const path of [`reel/${code}`, `p/${code}`, `reel/${code}/embed/captioned`]) {
    try {
      const r = await fetch(`https://www.instagram.com/${path}/`, {
        headers: { "User-Agent": UA_CRAWLER, Accept: "text/html", "Accept-Language": "en-US,en;q=0.9" },
      });
      if (!r.ok) continue;
      const html = await r.text();
      const m =
        html.match(/property="og:image"\s+content="([^"]+)"/i) ||
        html.match(/content="([^"]+)"\s+property="og:image"/i) ||
        html.match(/"display_url":"([^"]+)"/i) ||
        html.match(/class="EmbeddedMediaImage"[^>]*?\ssrc="([^"]+)"/i);
      if (m) return decode(m[1]);
    } catch {}
  }
  return "";
}

export default async function handler(req, res) {
  const code = shortcode(req);
  if (!code) return res.status(400).json({ error: "shortcode or url required" });
  try {
    const img = await findOgImage(code);
    if (!img) { res.setHeader("Cache-Control", "public, s-maxage=600"); return res.status(404).json({ error: "no thumbnail" }); }
    const ir = await fetch(img, { headers: { "User-Agent": UA_BROWSER, Accept: "image/*" } });
    if (!ir.ok) return res.status(502).json({ error: "image fetch failed" });
    const buf = Buffer.from(await ir.arrayBuffer());
    res.setHeader("Content-Type", ir.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).send(buf);
  } catch {
    return res.status(502).json({ error: "proxy error" });
  }
}
