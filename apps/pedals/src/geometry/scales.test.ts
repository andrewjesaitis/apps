import { describe, it, expect } from "vitest";
import { px, py, W, H, M } from "./scales";

describe("scales", () => {
  it("maps clip 0 to the left margin and 10 to the right edge", () => {
    expect(px(0)).toBe(M.L);
    expect(px(10)).toBe(W - M.R);
  });

  it("maps gain 0 to the bottom and 10 to the top (y inverted)", () => {
    expect(py(0)).toBe(H - M.B);
    expect(py(10)).toBe(M.T);
    expect(py(10)).toBeLessThan(py(0));
  });
});
