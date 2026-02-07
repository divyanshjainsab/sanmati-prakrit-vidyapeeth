"use client";
import { ReactNode } from "react";

type ImageModalProps = {
  src: string;
  alt?: string;
  onClose: () => void;
};

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="relative max-w-full max-h-full">
        <img
          src={src}
          alt={alt || ""}
          className="max-w-full max-h-[80vh] rounded shadow-lg"
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow hover:bg-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
