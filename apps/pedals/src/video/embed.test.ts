import { describe, it, expect } from "vitest";
import { youtubeEmbedUrl } from "./embed";

describe("youtubeEmbedUrl", () => {
  it("builds a nocookie embed URL with rel and autoplay, no start", () => {
    expect(youtubeEmbedUrl({ youtubeId: "abc123DEF45" })).toBe(
      "https://www.youtube-nocookie.com/embed/abc123DEF45?rel=0&autoplay=1",
    );
  });

  it("appends start when set", () => {
    expect(youtubeEmbedUrl({ youtubeId: "abc123DEF45", start: 312 })).toBe(
      "https://www.youtube-nocookie.com/embed/abc123DEF45?rel=0&autoplay=1&start=312",
    );
  });

  it("honors start=0 (uses !== undefined, not a falsy check)", () => {
    expect(youtubeEmbedUrl({ youtubeId: "abc123DEF45", start: 0 })).toContain("start=0");
  });
});
