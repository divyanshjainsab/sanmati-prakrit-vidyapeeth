import { describe, it, expect, beforeEach, vi } from "vitest";
import { isRateLimited, recordFailedAttempt, clearAttempts, getClientIp } from "./rate-limit";

describe("rate-limit", () => {
  const key = "test-ip-1";

  beforeEach(() => {
    clearAttempts(key);
    clearAttempts("test-ip-2");
    vi.useRealTimers();
  });

  it("allows attempts under the threshold", () => {
    for (let i = 0; i < 4; i++) {
      expect(isRateLimited(key)).toBe(false);
      recordFailedAttempt(key);
    }
    expect(isRateLimited(key)).toBe(false);
  });

  it("blocks after 5 failed attempts", () => {
    for (let i = 0; i < 5; i++) recordFailedAttempt(key);
    expect(isRateLimited(key)).toBe(true);
  });

  it("clearAttempts resets the counter (e.g. after a successful login)", () => {
    for (let i = 0; i < 5; i++) recordFailedAttempt(key);
    expect(isRateLimited(key)).toBe(true);

    clearAttempts(key);
    expect(isRateLimited(key)).toBe(false);
  });

  it("tracks separate IPs independently", () => {
    for (let i = 0; i < 5; i++) recordFailedAttempt(key);
    expect(isRateLimited(key)).toBe(true);
    expect(isRateLimited("test-ip-2")).toBe(false);
  });

  it("expires the lockout after the window elapses", () => {
    vi.useFakeTimers();
    const key2 = "test-ip-expiry";
    clearAttempts(key2);

    for (let i = 0; i < 5; i++) recordFailedAttempt(key2);
    expect(isRateLimited(key2)).toBe(true);

    vi.advanceTimersByTime(15 * 60 * 1000 + 1);
    expect(isRateLimited(key2)).toBe(false);
  });
});

describe("getClientIp", () => {
  it("prefers the first x-forwarded-for entry", () => {
    const req = { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } };
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to socket.remoteAddress", () => {
    const req = { headers: {}, socket: { remoteAddress: "9.9.9.9" } };
    expect(getClientIp(req)).toBe("9.9.9.9");
  });

  it("falls back to 'unknown' when nothing is available", () => {
    const req = { headers: {} };
    expect(getClientIp(req)).toBe("unknown");
  });
});
