/* Posts data access — reads the editable content store (public/content/posts.json,
   written by the admin panel). Posts are Instagram comment-automation link pages. */

/** Extract the shortcode from an Instagram reel/post link. */
export function instaShortcode(url) {
  const m = String(url || "").match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
  return m ? m[1] : "";
}

/** Build an Instagram embed URL from a reel/post link (or return '' if unrecognised). */
export function instaEmbed(url) {
  if (!url) return "";
  const m = String(url).match(/instagram\.com\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
  if (!m) return "";
  const type = m[1].toLowerCase() === "reels" ? "reel" : m[1].toLowerCase();
  return `https://www.instagram.com/${type}/${m[2]}/embed`;
}

/** Instagram thumbnail via our server-side proxy (reads the reel's og:image). */
export function instaThumb(url) {
  const code = instaShortcode(url);
  return code ? `/api/insta-thumb?c=${code}` : "";
}

/** URL-safe slug for a video id (e.g. "CK 01" -> "ck-01"). */
export const slugifyId = (v) => String(v || "").trim().toLowerCase().replace(/[^\w-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

let _cache = null;

export async function fetchPosts() {
  if (_cache) return _cache;
  try {
    const r = await fetch("/content/posts.json", { cache: "no-cache" });
    if (!r.ok) return [];
    const d = await r.json();
    _cache = Array.isArray(d.posts) ? d.posts : [];
    return _cache;
  } catch {
    return [];
  }
}

export async function fetchPublishedPosts() {
  const posts = await fetchPosts();
  return posts
    .filter((p) => p.status === "published")
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

export async function fetchPost(id) {
  const posts = await fetchPosts();
  const key = slugifyId(id);
  return posts.find((p) => slugifyId(p.id) === key) || null;
}
