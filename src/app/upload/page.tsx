"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function UploadPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Check if already authenticated via cookie
  useEffect(() => {
    axios.get("/api/check-upload-auth").then((res) => {
      setAuthenticated(res.data.authenticated);
      setLoadingAuth(false);
    });
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/upload-auth", { username, password });
      setAuthenticated(true);
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  // Upload handler
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include", // send cookie for auth
    });

    const data = await res.json();
    setResult(data);
    setUploading(false);
  };

  if (loadingAuth) return <p>Loading...</p>;

  // Show login form if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    );
  }

  // Authenticated: show upload form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <form
        onSubmit={handleUpload}
        className="w-full max-w-md flex flex-col gap-4 border p-4 rounded-lg shadow"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full"
        />
        <button
          disabled={uploading}
          className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {result?.success && (
        <div className="mt-4 text-center">
          <p className="font-medium mb-2">Uploaded Successfully:</p>
          <img
            src={result.data.url}
            alt="Uploaded"
            className="mx-auto rounded-lg max-w-full"
          />
        </div>
      )}
    </div>
  );
}
