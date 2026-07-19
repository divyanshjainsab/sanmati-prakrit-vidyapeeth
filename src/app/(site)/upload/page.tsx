"use client";

import { useState } from "react";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import { useSessionAuth } from "@/hooks/useSessionAuth";
import { API_ROUTES } from "@/lib/routes";

type UploadResult = {
  success: boolean;
  data?: { url: string };
  message?: string;
};

export default function UploadPage() {
  const { authenticated, loading: authLoading, login } = useSessionAuth();

  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", alt);

      const res = await fetch(API_ROUTES.upload, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data: UploadResult = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Upload failed");
      } else {
        setResult(data);
      }
    } catch {
      setError("Upload failed — check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) return <p>Loading...</p>;

  if (!authenticated) {
    return <LoginForm onSubmit={login} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <form
        onSubmit={handleUpload}
        className="w-full max-w-md flex flex-col gap-4 border p-4 rounded-lg shadow"
      >
        <label htmlFor="upload-file" className="sr-only">
          Image file
        </label>
        <input
          id="upload-file"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full"
        />
        <label htmlFor="upload-alt" className="sr-only">
          Alt text (optional)
        </label>
        <input
          id="upload-alt"
          type="text"
          placeholder="Alt text (optional)"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          disabled={uploading || !file}
          className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-red-600 text-center">
          {error}
        </p>
      )}

      {result?.success && result.data && (
        <div className="mt-4 text-center">
          <p className="font-medium mb-2">Uploaded Successfully:</p>
          <div className="relative mx-auto w-full max-w-md aspect-video">
            <Image
              src={result.data.url}
              alt={alt || "Uploaded image"}
              fill
              sizes="(max-width: 640px) 100vw, 448px"
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
