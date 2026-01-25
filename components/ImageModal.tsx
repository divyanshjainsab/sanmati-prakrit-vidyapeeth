"use client";

type ImageModalProps = {
  src: string;
  alt?: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function ImageModal({ src, alt, onClose, onNext, onPrev }: ImageModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        cursor: "pointer",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "90vw",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#111", // optional: modal bg
          borderRadius: "8px",
        }}
      >
        {/* Image */}
        <img
          src={src}
          alt={alt || ""}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: "8px",
          }}
        />

        {/* Left button */}
        <button
          onClick={onPrev}
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.7)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
        >
          ◀
        </button>

        {/* Right button */}
        <button
          onClick={onNext}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.7)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
        >
          ▶
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "white",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
