// Live website thumbnail via WordPress mShots (free, no key). Renders the actual
// current site, so project previews stay up to date without storing screenshots.
export function liveShot(url, w = 1280, h = 960) {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=${w}&h=${h}`;
}
