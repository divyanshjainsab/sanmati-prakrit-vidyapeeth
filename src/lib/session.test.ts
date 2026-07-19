import { describe, it, expect, beforeEach } from "vitest";
import { signSession, verifySession } from "./session";

describe("session", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-secret-please-change";
  });

  it("round-trips a valid token and returns the tenant", () => {
    const token = signSession("acme");
    const payload = verifySession(token);
    expect(payload?.tenant).toBe("acme");
  });

  it("rejects a tampered payload", () => {
    const token = signSession("acme");
    const tampered = token.replace(
      /^[^.]+/,
      Buffer.from('{"tenant":"evil","exp":9999999999}').toString("base64url")
    );
    expect(verifySession(tampered)).toBeNull();
  });

  it("rejects an expired token", () => {
    const past = Date.now() - 1000 * 60 * 60 * 48;
    const token = signSession("acme", 60, past); // minted 48h ago, 60s TTL
    expect(verifySession(token)).toBeNull();
  });

  it("rejects garbage and empty input", () => {
    expect(verifySession(null)).toBeNull();
    expect(verifySession("")).toBeNull();
    expect(verifySession("no-dot")).toBeNull();
    expect(verifySession("a.b.c")).toBeNull();
  });

  it("rejects a token signed with a different secret", () => {
    const token = signSession("acme");
    process.env.SESSION_SECRET = "a-different-secret";
    expect(verifySession(token)).toBeNull();
  });
});
