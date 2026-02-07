"use client";
import { useState, useEffect } from "react";

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

  if (!images || images.length === 0) return null;

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
      <div className="relative max-w-full max-h-full flex items-center justify-center">

        {/* Image */}
        <img
          src={currentImage.url}
          alt={currentImage.alt || ""}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-lg"
        />

        {/* Left */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 bg-black/50 text-white text-3xl rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
          >
            ‹
          </button>
        )}

        {/* Right */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 bg-black/50 text-white text-3xl rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
          >
            ›
          </button>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
