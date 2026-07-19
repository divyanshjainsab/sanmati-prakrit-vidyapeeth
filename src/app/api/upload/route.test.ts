import { describe, it, expect, beforeEach, vi } from "vitest";
import { signSession } from "@/lib/session";

const uploadBuffer = vi.fn();
const create = vi.fn();

vi.mock("@/lib/cloudinary", () => ({
  uploadBuffer: (...args: unknown[]) => uploadBuffer(...args),
}));

vi.mock("@/lib/mongoose", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/models/Image", () => ({
  default: { create: (...args: unknown[]) => create(...args) },
}));

import { POST } from "./route";

// No configured root domain + localhost host → default tenant "main".
let sessionCookie: string;

function uploadRequest(opts: { authed?: boolean; file?: File | string; alt?: string }): Request {
  const fd = new FormData();
  if (opts.file !== undefined) fd.append("file", opts.file);
  if (opts.alt !== undefined) fd.append("alt", opts.alt);

  return new Request("http://localhost/api/upload", {
    method: "POST",
    headers: opts.authed ? { cookie: `session=${sessionCookie}` } : {},
    body: fd,
  });
}

const imageFile = () =>
  new File([new Uint8Array([1, 2, 3, 4])], "photo.png", { type: "image/png" });

describe("POST /api/upload", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-secret";
    sessionCookie = signSession("main");
    uploadBuffer.mockReset();
    create.mockReset();
  });

  it("returns 401 without a valid session cookie", async () => {
    const res = await POST(uploadRequest({ file: imageFile() }));
    expect(res.status).toBe(401);
    expect(uploadBuffer).not.toHaveBeenCalled();
  });

  it("returns 400 when no file is provided", async () => {
    const res = await POST(uploadRequest({ authed: true }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a non-image file", async () => {
    const textFile = new File(["hello"], "notes.txt", { type: "text/plain" });
    const res = await POST(uploadRequest({ authed: true, file: textFile }));
    expect(res.status).toBe(400);
    expect(uploadBuffer).not.toHaveBeenCalled();
  });

  it("uploads to the tenant-namespaced folder and persists with tenant + alt", async () => {
    uploadBuffer.mockResolvedValue({
      secure_url: "https://cdn/x.png",
      public_id: "gallery/main/x",
    });
    create.mockResolvedValue({ _id: "1" });

    const res = await POST(uploadRequest({ authed: true, file: imageFile(), alt: "a cat" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(uploadBuffer).toHaveBeenCalledWith(expect.anything(), "gallery/main");
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ tenant: "main", url: "https://cdn/x.png", alt: "a cat" })
    );
  });

  it("returns 500 when the upload provider throws", async () => {
    uploadBuffer.mockRejectedValue(new Error("cloudinary down"));

    const res = await POST(uploadRequest({ authed: true, file: imageFile() }));
    expect(res.status).toBe(500);
  });
});
