import { describe, it, expect, vi, afterEach } from "vitest";
import { submitSuggestion } from "./client";

const payload = { id: "ts808", name: "Tube Screamer", clip: 3, gain: 5, transp: 6 };

afterEach(() => {
  vi.restoreAllMocks();
});

describe("submitSuggestion", () => {
  it("POSTs payload + token as text/plain and returns parsed result", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitSuggestion("https://script/exec", payload, "tok123");

    expect(result).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://script/exec");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("text/plain;charset=utf-8");
    expect(JSON.parse(init.body)).toEqual({ ...payload, token: "tok123" });
  });

  it("returns a network error result when fetch throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const result = await submitSuggestion("https://script/exec", payload, "tok");
    expect(result).toEqual({ ok: false, error: "network" });
  });

  it("returns a server error result on a non-ok HTTP response", async () => {
    const jsonSpy = vi.fn();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: jsonSpy }));
    const result = await submitSuggestion("https://script/exec", payload, "tok");
    expect(result).toEqual({ ok: false, error: "server" });
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it("returns a server error when an ok response has a non-JSON body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.reject(new Error("not json")) }),
    );
    const result = await submitSuggestion("https://script/exec", payload, "tok");
    expect(result).toEqual({ ok: false, error: "server" });
  });
});
