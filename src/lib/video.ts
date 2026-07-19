/**
 * Helpers for turning a Google Drive share link into an embeddable player URL
 * and a poster thumbnail. Supports the common Drive link shapes plus a bare
 * file id:
 *   https://drive.google.com/file/d/<ID>/view?usp=sharing
 *   https://drive.google.com/open?id=<ID>
 *   https://drive.google.com/uc?id=<ID>&export=download
 *   <ID>
 */
export function getDriveFileId(url: string | undefined | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const patterns = [/\/file\/d\/([^/?#]+)/, /[?&]id=([^&#]+)/, /\/d\/([^/?#]+)/];
  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match?.[1]) return match[1];
  }

  // A bare id (no slashes / query) is accepted as-is.
  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) return trimmed;

  return null;
}

export function getDriveEmbedUrl(url: string | undefined | null): string | null {
  const id = getDriveFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

export function getDriveThumbnailUrl(url: string | undefined | null): string | null {
  const id = getDriveFileId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1600` : null;
}
