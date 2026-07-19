import { describe, it, expect } from "vitest";
import { getDriveFileId, getDriveEmbedUrl, getDriveThumbnailUrl } from "./video";

const ID = "1A2b3C4d5E6f7G8h9I0jK";

describe("getDriveFileId", () => {
  it("extracts the id from a /file/d/<id>/view share link", () => {
    expect(getDriveFileId(`https://drive.google.com/file/d/${ID}/view?usp=sharing`)).toBe(ID);
  });

  it("extracts the id from an open?id= link", () => {
    expect(getDriveFileId(`https://drive.google.com/open?id=${ID}`)).toBe(ID);
  });

  it("extracts the id from a uc?export=download&id= link", () => {
    expect(getDriveFileId(`https://drive.google.com/uc?export=download&id=${ID}`)).toBe(ID);
  });

  it("accepts a bare id", () => {
    expect(getDriveFileId(ID)).toBe(ID);
  });

  it("returns null for empty/garbage input", () => {
    expect(getDriveFileId("")).toBeNull();
    expect(getDriveFileId(undefined)).toBeNull();
    expect(getDriveFileId("not a link")).toBeNull();
  });
});

describe("getDriveEmbedUrl", () => {
  it("builds the /preview embed url", () => {
    expect(getDriveEmbedUrl(`https://drive.google.com/file/d/${ID}/view`)).toBe(
      `https://drive.google.com/file/d/${ID}/preview`
    );
  });

  it("returns null when no id is present", () => {
    expect(getDriveEmbedUrl("https://example.com/video")).toBeNull();
  });
});

describe("getDriveThumbnailUrl", () => {
  it("builds a thumbnail url with a width hint", () => {
    expect(getDriveThumbnailUrl(ID)).toBe(`https://drive.google.com/thumbnail?id=${ID}&sz=w1600`);
  });
});
