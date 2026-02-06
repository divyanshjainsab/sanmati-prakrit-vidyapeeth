"use client";

type ImageModalProps = {
  src: string;
  alt?: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function ImageModal({
  src,
  alt,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps) {
  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/80 backdrop-blur-sm
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          flex items-center justify-center
          h-[90vh] w-[92vw] md:w-[85vw]
          rounded-2xl
          bg-neutral-900
          shadow-2xl
        "
      >
        {/* Image */}
        <img
          src={src}
          alt={alt || ""}
          className="
            max-h-full max-w-full
            rounded-xl
            object-contain
          "
        />

        {/* Prev */}
        <button
          onClick={onPrev}
          className="
            absolute left-3 top-1/2 -translate-y-1/2
            flex h-11 w-11 items-center justify-center
            rounded-full
            bg-white/90 text-neutral-900
            shadow-lg
            transition
            hover:scale-110 hover:bg-white
            active:scale-95
          "
        >
          ◀
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            flex h-11 w-11 items-center justify-center
            rounded-full
            bg-white/90 text-neutral-900
            shadow-lg
            transition
            hover:scale-110 hover:bg-white
            active:scale-95
          "
        >
          ▶
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute right-3 top-3
            flex h-9 w-9 items-center justify-center
            rounded-full
            bg-white/90 text-neutral-900
            shadow-md
            transition
            hover:rotate-90 hover:bg-white
            active:scale-95
          "
        >
          ✕
        </button>
      </div>
    </div>
  );
}
