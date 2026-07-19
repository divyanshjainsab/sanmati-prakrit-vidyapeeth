"use client";
import { useRef, useState } from "react";
import axios from "axios";
import ImageModal from "./ImageModal";
import { API_ROUTES } from "@/lib/routes";

type ImageInputProps = {
  src: string;
  alt?: string;
  onChange: (newSrc: string) => void;
  placeholder?: string;
};

export default function ImageInput({ src, alt, onChange, placeholder }: ImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleUploadClick = () => fileInputRef.current?.click();
  const handlePreviewClick = () => setModalOpen(true);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(API_ROUTES.adminUpload, formData);
      if (res.data.success) {
        onChange(res.data.data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full space-y-2 sm:space-y-0">
      <input
        type="text"
        placeholder={placeholder || "Image URL"}
        value={src}
        onChange={handleInputChange}
        className="border p-2 rounded flex-1 w-full sm:w-auto"
      />
      {src ? (
        <button
          type="button"
          onClick={handlePreviewClick}
          className="bg-blue-500 text-white px-3 py-1 rounded flex-shrink-0"
        >
          Preview
        </button>
      ) : (
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={loading}
          className="bg-green-500 text-white px-3 py-1 rounded flex-shrink-0 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {modalOpen && src && <ImageModal src={src} alt={alt} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
