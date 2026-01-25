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
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        cursor: "pointer",
        overflow: "hidden",
        borderRadius: "10px",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
