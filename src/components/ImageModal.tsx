"use client";

import { useEffect } from "react";

type ImageModalProps = {
  src: string;
  alt?: string;
  onClose: () => void;
};

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
    >
      <div className="relative max-w-full max-h-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- previews arbitrary admin-entered URLs, not guaranteed to match next.config remotePatterns */}
        <img src={src} alt={alt || ""} className="max-w-full max-h-[80vh] rounded shadow-lg" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow hover:bg-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
