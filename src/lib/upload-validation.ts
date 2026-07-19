const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export type FileValidationResult = { ok: true; file: File } | { ok: false; message: string };

export function validateImageFile(value: FormDataEntryValue | null): FileValidationResult {
  if (!(value instanceof File) || value.size === 0) {
    return { ok: false, message: "No file provided" };
  }

  if (!value.type.startsWith("image/")) {
    return { ok: false, message: "Only image files are allowed" };
  }

  if (value.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "File too large (max 10MB)" };
  }

  return { ok: true, file: value };
}
