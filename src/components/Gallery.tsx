"use client";

import { useState } from "react";
import ImageCard from "@/components/ImageCard";
import ImageModal from "@/components/ImageModal";

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
};

const totalImages = 61;
const gallery: GalleryImage[] = Array.from({ length: totalImages }, (_, i) => ({
  id: i + 1,
  src: `/images/gallery/${i + 1}.jpg`,
  alt: `Image ${i + 1}`,
}));

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % gallery.length);
    }
  };

  const handlePrev = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + gallery.length) % gallery.length);
    }
  };

  const closeModal = () => setActiveIndex(null);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 p-5">
        {gallery.map((img, index) => (
          <ImageCard
            key={img.id}
            src={img.src}
            alt={img.alt}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {activeIndex !== null && (
        <ImageModal
          src={gallery[activeIndex].src}
          alt={gallery[activeIndex].alt}
          onClose={closeModal}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
}
