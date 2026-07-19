import { describe, it, expect, beforeEach, vi } from "vitest";

const lean = vi.fn();
const skip = vi.fn();
const limit = vi.fn();
const sort = vi.fn();
const find = vi.fn();

// Chainable query builder: find().sort().skip().limit().lean()
const chain = {
  sort: (...a: unknown[]) => {
    sort(...a);
    return chain;
  },
  skip: (...a: unknown[]) => {
    skip(...a);
    return chain;
  },
  limit: (...a: unknown[]) => {
    limit(...a);
    return chain;
  },
  lean: () => lean(),
};

vi.mock("@/lib/mongoose", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/models/Image", () => ({
  default: {
    find: (...a: unknown[]) => {
      find(...a);
      return chain;
    },
  },
}));

import { GET } from "./route";

function galleryRequest(query = "") {
  return new Request(`http://localhost/api/gallery${query}`);
}

describe("GET /api/gallery", () => {
  beforeEach(() => {
    lean.mockReset();
    skip.mockReset();
    limit.mockReset();
    sort.mockReset();
    find.mockReset();
  });

  it("returns hasMore=true and trims the extra lookahead item", async () => {
    // limit=2 requests 3 (limit+1); 3 returned means there IS another page.
    lean.mockResolvedValue([{ url: "1" }, { url: "2" }, { url: "3" }]);

    const res = await GET(galleryRequest("?page=0&limit=2"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.hasMore).toBe(true);
    expect(body.data).toHaveLength(2);
    expect(body.page).toBe(0);
    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(3);
  });

  it("returns hasMore=false when fewer than a full page come back", async () => {
    lean.mockResolvedValue([{ url: "1" }]);

    const res = await GET(galleryRequest("?page=1&limit=10"));
    const body = await res.json();

    expect(body.hasMore).toBe(false);
    expect(body.data).toHaveLength(1);
    expect(skip).toHaveBeenCalledWith(10); // page 1 * limit 10
  });

  it("clamps a garbage limit to the default and never goes negative on page", async () => {
    lean.mockResolvedValue([]);

    await GET(galleryRequest("?page=-5&limit=abc"));

    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(25); // default 24 + 1 lookahead
  });

  it("returns 500 when the query throws", async () => {
    lean.mockRejectedValue(new Error("db down"));

    const res = await GET(galleryRequest());
    expect(res.status).toBe(500);
  });
});
