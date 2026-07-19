// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

const get = vi.fn();
const post = vi.fn();

vi.mock("axios", () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
  },
}));

import { useSessionAuth } from "./useSessionAuth";

describe("useSessionAuth", () => {
  beforeEach(() => {
    get.mockReset();
    post.mockReset();
  });

  it("reports authenticated when check-auth returns true", async () => {
    get.mockResolvedValue({ data: { success: true, data: { authenticated: true } } });

    const { result } = renderHook(() => useSessionAuth());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.authenticated).toBe(true);
    expect(get).toHaveBeenCalledWith("/api/check-auth");
  });

  it("treats a failed check-auth as unauthenticated", async () => {
    get.mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useSessionAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.authenticated).toBe(false);
  });

  it("login returns true and flips authenticated on success", async () => {
    get.mockResolvedValue({ data: { success: true, data: { authenticated: false } } });
    post.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useSessionAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.login("alice", "s3cret");
    });

    expect(ok).toBe(true);
    expect(post).toHaveBeenCalledWith("/api/auth", { username: "alice", password: "s3cret" });
    expect(result.current.authenticated).toBe(true);
  });

  it("login returns false on rejection and leaves authenticated false", async () => {
    get.mockResolvedValue({ data: { success: true, data: { authenticated: false } } });
    post.mockRejectedValue(new Error("401"));

    const { result } = renderHook(() => useSessionAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.login("alice", "bad");
    });

    expect(ok).toBe(false);
    expect(result.current.authenticated).toBe(false);
  });

  it("logout posts and clears authenticated", async () => {
    get.mockResolvedValue({ data: { success: true, data: { authenticated: true } } });
    post.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useSessionAuth());
    await waitFor(() => expect(result.current.authenticated).toBe(true));

    await act(async () => {
      await result.current.logout();
    });

    expect(post).toHaveBeenCalledWith("/api/logout");
    expect(result.current.authenticated).toBe(false);
  });
});
