"use client";

import { useState } from "react";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import { useSessionAuth } from "@/hooks/useSessionAuth";
import { useI18n } from "@/components/I18nProvider";
import { API_ROUTES } from "@/lib/routes";

type UploadResult = {
  success: boolean;
  data?: { url: string };
  message?: string;
};

export default function UploadPage() {
  const { messages } = useI18n();
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
        setError(data.message || messages.upload.failed);
      } else {
        setResult(data);
      }
    } catch {
      setError(messages.upload.failed);
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) return <p className="p-8 text-center">{messages.common.loading}</p>;

  if (!authenticated) {
    return <LoginForm onSubmit={login} labels={messages.login} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 font-serif text-2xl font-bold text-maroon-800">
        {messages.upload.title}
      </h1>
      <form
        onSubmit={handleUpload}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border p-4 shadow"
      >
        <label htmlFor="upload-file" className="sr-only">
          {messages.upload.file}
        </label>
        <input
          id="upload-file"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full"
        />
        <label htmlFor="upload-alt" className="sr-only">
          {messages.upload.alt}
        </label>
        <input
          id="upload-alt"
          type="text"
          placeholder={messages.upload.alt}
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="rounded border p-2"
        />
        <button
          disabled={uploading || !file}
          className="rounded-lg bg-maroon-800 py-2 font-semibold text-cream hover:bg-maroon-900 disabled:opacity-50"
        >
          {uploading ? messages.upload.uploading : messages.upload.submit}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-center text-red-600">
          {error}
        </p>
      )}

      {result?.success && result.data && (
        <div className="mt-4 text-center">
          <p className="mb-2 font-medium">{messages.upload.success}</p>
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
