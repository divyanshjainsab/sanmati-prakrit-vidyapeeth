"use client";

type ImageCardProps = {
  src: string;
  alt: string;
  onClick: () => void;
};

export default function ImageCard({ src, alt, onClick }: ImageCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        relative
        aspect-square
        w-full
        cursor-pointer
        overflow-hidden
        rounded-lg
      "
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
