"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import GalleryModal from "@/components/admin/GalleryModal";
import SectionHeading from "@/components/ui/SectionHeading";
import { API_ROUTES } from "@/lib/routes";
import { useI18n } from "@/components/I18nProvider";

type GalleryImage = {
  url: string;
  alt?: string;
  publicId?: string;
};

type Status = "loading" | "ready" | "error";

const PAGE_SIZE = 24;

export default function GalleryPage() {
  const { messages } = useI18n();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<Status>("loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadPage = useCallback(async (pageToLoad: number) => {
    const res = await axios.get(API_ROUTES.gallery, {
      params: { page: pageToLoad, limit: PAGE_SIZE },
    });
    if (!res.data.success) throw new Error(res.data.message || "Failed to load images");
    return res.data as { data: GalleryImage[]; hasMore: boolean };
  }, []);

  useEffect(() => {
    setStatus("loading");
    loadPage(0)
      .then((res) => {
        setImages(res.data);
        setHasMore(res.hasMore);
        setPage(0);
        setStatus("ready");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, [loadPage]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await loadPage(page + 1);
      setImages((prev) => [...prev, ...res.data]);
      setHasMore(res.hasMore);
      setPage((p) => p + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mb-12 flex justify-center">
          <SectionHeading
            eyebrow={messages.galleryPreview.eyebrow}
            title={messages.gallery.title}
            subtitle={messages.gallery.subtitle}
          />
        </div>

        {status === "loading" && (
          <p className="text-center text-maroon-700/70">{messages.gallery.loading}</p>
        )}

        {status === "error" && (
          <p role="alert" className="text-center text-red-700">
            {messages.gallery.error}
          </p>
        )}

        {status === "ready" && images.length === 0 && (
          <p className="text-center text-maroon-700/70">{messages.gallery.empty}</p>
        )}

        {status === "ready" && images.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img, idx) => (
                <button
                  key={img.publicId || idx}
                  onClick={() => openModal(idx)}
                  aria-label={img.alt || `Open image ${idx + 1}`}
                  className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-saffron-200/60 shadow-sm transition hover:shadow-md"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || ""}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-full bg-maroon-800 px-8 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-maroon-900 disabled:opacity-50"
                >
                  {loadingMore ? messages.gallery.loadingMore : messages.gallery.loadMore}
                </button>
              </div>
            )}
          </>
        )}
      </div>

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
