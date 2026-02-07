"use client";
import { useRef, useState } from "react";
import axios from "axios";
import ImageModal from "./ImageModal";

type ImageInputProps = {
  src: string;
  alt?: string;
  onChange: (newSrc: string) => void;
  placeholder?: string;
};

export default function ImageInput({ src, alt, onChange, placeholder }: ImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(src || "");
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

      const res = await axios.post("/api/admin-upload", formData);
      if (res.data.success) {
        setUrl(res.data.url);
        onChange(res.data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full space-y-2 sm:space-y-0">
      <input
        type="text"
        placeholder={placeholder || "Image URL"}
        value={url}
        onChange={handleInputChange}
        className="border p-2 rounded flex-1 w-full sm:w-auto"
      />
      {url ? (
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
          className="bg-green-500 text-white px-3 py-1 rounded flex-shrink-0"
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

      {modalOpen && url && (
        <ImageModal src={url} alt={alt} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
