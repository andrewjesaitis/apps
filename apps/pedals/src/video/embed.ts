import type { PedalDemo } from "../types";

// Build a privacy-enhanced youtube-nocookie embed URL for a curated demo.
// autoplay=1 because mounting the iframe is itself the visitor's play intent;
// rel=0 trims related-video clutter; start is included only when set (0 counts).
export function youtubeEmbedUrl(demo: PedalDemo): string {
  const params = new URLSearchParams({ rel: "0", autoplay: "1" });
  if (demo.start !== undefined) {
    params.set("start", String(demo.start));
  }
  return `https://www.youtube-nocookie.com/embed/${demo.youtubeId}?${params}`;
}
