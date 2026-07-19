"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type GalleryImage = {
  url: string;
  alt?: string;
};

type GalleryModalProps = {
  images: GalleryImage[];
  startIndex?: number;
  onClose: () => void;
};

export default function GalleryModal({ images, startIndex = 0, onClose }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  const next = useCallback(() => setCurrentIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, next, prev]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
    >
      <div className="relative w-full max-w-4xl h-[85vh] flex items-center justify-center">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || ""}
          fill
          sizes="90vw"
          className="object-contain rounded shadow-lg"
        />

        {images.length > 1 && (
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 bg-black/50 text-white text-3xl rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
          >
            ‹
          </button>
        )}

        {images.length > 1 && (
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 bg-black/50 text-white text-3xl rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
          >
            ›
          </button>
        )}

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
