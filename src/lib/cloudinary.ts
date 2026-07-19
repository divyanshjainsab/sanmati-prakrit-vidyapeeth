import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  secure: true,
});

export function uploadBuffer(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err || !result) return reject(err ?? new Error("Cloudinary upload returned no result"));
        resolve(result);
      })
      .end(buffer);
  });
}

export default cloudinary;
