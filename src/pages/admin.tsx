"use client";
import "../app/globals.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageInput from "@/components/ImageInput";

type ImageAsset = { src: string; alt?: string };
type Social = { type: "instagram" | "facebook" | "youtube"; url: string };
type NavigationItem = { label: string; href: string; icon?: string; external?: boolean };
type TextSection = {
  heading?: string;
  paragraph?: string;
  bgColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
  boldText?: string;
};

type SiteConfig = {
  _id: string;
  meta: { name: string; logo: ImageAsset };
  contact: { phone: string; whatsapp: { url: string; label: string } };
  hero: { mobile: ImageAsset[]; desktop: ImageAsset[]; interval: number };
  navigation: NavigationItem[];
  textSections: TextSection[];
  socials: Social[];
};

export default function AdminPanel() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  useEffect(() => {
    axios
      .get("/api/siteconfig")
      .then((res) => {
        setConfig(res.data);
        setAuth(true);
      })
      .catch(() => setAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  if (!auth) {
    const login = async () => {
      try {
        await axios.post("/api/auth", credentials);
        setAuth(true);
        const res = await axios.get("/api/siteconfig");
        setConfig(res.data);
      } catch {
        alert("Invalid credentials");
      }
    };

    return (
      <div className="p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <input
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          placeholder="Password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          className="border p-2 mb-4 w-full rounded"
        />
        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 w-full rounded"
        >
          Login
        </button>
      </div>
    );
  }

  if (!config) return <div className="p-4">No config loaded</div>;

  const save = async () => {
    try {
      await axios.post("/api/siteconfig", config);
      alert("Config saved successfully!");
    } catch {
      alert("Failed to save config.");
    }
  };

  const logout = async () => {
    await axios.post("/api/logout");
    setAuth(false);
  };

  const updateField = (path: string[], value: any) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newConfig = { ...prev };
      let cur: any = newConfig;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  const addItem = (path: string[], item: any) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newConfig = { ...prev };
      let cur: any = newConfig;
      for (let i = 0; i < path.length; i++) cur = cur[path[i]];
      cur.push(item);
      return newConfig;
    });
  };

  const removeItem = (path: string[], index: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newConfig = { ...prev };
      let cur: any = newConfig;
      for (let i = 0; i < path.length; i++) cur = cur[path[i]];
      cur.splice(index, 1);
      return newConfig;
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Panel</h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Meta */}
      <section className="border p-4 rounded shadow space-y-3">
        <h3 className="font-bold text-lg">Meta</h3>
        <label className="font-medium">Website Name</label>
        <input
          placeholder="Website Name"
          value={config.meta.name}
          onChange={(e) => updateField(["meta", "name"], e.target.value)}
          className="border p-2 w-full rounded"
        />
        <label className="font-medium">Logo Image</label>
        <ImageInput
          src={config.meta.logo.src}
          alt={config.meta.logo.alt}
          onChange={(newSrc) => updateField(["meta", "logo", "src"], newSrc)}
          placeholder="Upload Logo"
        />
        <label className="font-medium">Logo Alt Text (optional)</label>
        <input
          placeholder="Alt Text"
          value={config.meta.logo.alt || ""}
          onChange={(e) => updateField(["meta", "logo", "alt"], e.target.value)}
          className="border p-2 w-full rounded"
        />
      </section>

      {/* Contact */}
      <section className="border p-4 rounded shadow space-y-3">
        <h3 className="font-bold text-lg">Contact</h3>
        <label className="font-medium">Phone Number</label>
        <input
          placeholder="Phone Number"
          value={config.contact.phone}
          onChange={(e) => updateField(["contact", "phone"], e.target.value)}
          className="border p-2 w-full rounded"
        />
        <label className="font-medium">WhatsApp URL</label>
        <input
          placeholder="WhatsApp URL"
          value={config.contact.whatsapp.url}
          onChange={(e) => updateField(["contact", "whatsapp", "url"], e.target.value)}
          className="border p-2 w-full rounded"
        />
        <label className="font-medium">WhatsApp Label</label>
        <input
          placeholder="WhatsApp Label"
          value={config.contact.whatsapp.label}
          onChange={(e) => updateField(["contact", "whatsapp", "label"], e.target.value)}
          className="border p-2 w-full rounded"
        />
      </section>

      {/* Hero */}
      <section className="border p-4 rounded shadow space-y-4">
        <h3 className="font-bold text-lg">Hero Section</h3>
        <label className="font-medium">Interval (ms)</label>
        <input
          type="number"
          placeholder="Interval"
          value={config.hero.interval}
          onChange={(e) => updateField(["hero", "interval"], Number(e.target.value))}
          className="border p-2 w-32 rounded"
        />

        {/* Mobile Image */}
        <div className="space-y-2">
          <label className="font-medium">Mobile Image</label>
          <ImageInput
            src={config.hero.mobile.src}
            alt={config.hero.mobile.alt || ""}
            onChange={(newSrc) => updateField(["hero", "mobile", "src"], newSrc)}
            placeholder="Upload Mobile Image"
          />
          <input
            placeholder="Alt Text (optional)"
            value={config.hero.mobile.alt || ""}
            onChange={(e) => updateField(["hero", "mobile", "alt"], e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Desktop Images */}
        <div className="space-y-3">
          <label className="font-medium">Desktop Images</label>
          {config.hero.desktop.map((img, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
              <ImageInput
                src={img.src}
                alt={img.alt || ""}
                onChange={(newSrc) => updateField(["hero", "desktop", idx, "src"], newSrc)}
                placeholder="Upload Desktop Image"
              />
              <input
                placeholder="Alt Text (optional)"
                value={img.alt || ""}
                onChange={(e) => updateField(["hero", "desktop", idx, "alt"], e.target.value)}
                className="border p-2 w-full sm:w-1/2 rounded"
              />
              <button
                onClick={() => removeItem(["hero", "desktop"], idx)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem(["hero", "desktop"], { src: "", alt: "" })}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Desktop Image
          </button>
        </div>
      </section>


      {/* Navigation */}
      <section className="border p-4 rounded shadow space-y-3">
        <h3 className="font-bold text-lg">Navigation</h3>
        {config.navigation.map((nav, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <label className="font-medium w-full sm:w-auto">Label</label>
            <input
              placeholder="Label"
              value={nav.label}
              onChange={(e) => updateField(["navigation", idx, "label"], e.target.value)}
              className="border p-2 w-full sm:w-1/4 rounded"
            />
            <label className="font-medium w-full sm:w-auto">Href</label>
            <input
              placeholder="Href"
              value={nav.href}
              onChange={(e) => updateField(["navigation", idx, "href"], e.target.value)}
              className="border p-2 w-full sm:w-1/4 rounded"
            />
            <label className="font-medium w-full sm:w-auto">Icon</label>
            <input
              placeholder="Icon"
              value={nav.icon || ""}
              onChange={(e) => updateField(["navigation", idx, "icon"], e.target.value)}
              className="border p-2 w-full sm:w-1/4 rounded"
            />
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={nav.external || false}
                onChange={(e) => updateField(["navigation", idx, "external"], e.target.checked)}
              />
              <span>External</span>
            </label>
            <button
              onClick={() => removeItem(["navigation"], idx)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem(["navigation"], { label: "", href: "" })}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Navigation
        </button>
      </section>

      {/* Socials */}
      <section className="border p-4 rounded shadow space-y-3">
        <h3 className="font-bold text-lg">Socials</h3>
        {config.socials.map((soc, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <label className="font-medium w-full sm:w-auto">Type</label>
            <select
              value={soc.type}
              onChange={(e) => updateField(["socials", idx, "type"], e.target.value)}
              className="border p-2 w-full sm:w-1/4 rounded"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
            </select>
            <label className="font-medium w-full sm:w-auto">URL</label>
            <input
              placeholder="URL"
              value={soc.url}
              onChange={(e) => updateField(["socials", idx, "url"], e.target.value)}
              className="border p-2 w-full sm:w-3/4 rounded"
            />
            <button
              onClick={() => removeItem(["socials"], idx)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem(["socials"], { type: "instagram", url: "" })}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Social
        </button>
      </section>

      <button
        onClick={save}
        className="mt-6 bg-green-500 text-white px-6 py-3 rounded text-lg"
      >
        Save Config
      </button>
    </div>
  );
}
