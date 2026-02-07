"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import GalleryModal from "@/components/admin/GalleryModal";

type GalleryImage = {
  url: string;
  alt?: string;
  publicId?: string;
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("/api/gallery");
      if (res.data.success) setImages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Gallery</h2>

      {/* Grid of images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div
            key={img.publicId || idx}
            className="border rounded overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => openModal(idx)}
          >
            <img
              src={img.url}
              alt={img.alt || ""}
              className="object-cover w-full h-32 sm:h-40"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <GalleryModal
          images={images}
          startIndex={currentIndex}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
