"use client";
import "../app/globals.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageInput from "@/components/ImageInput";
import LoginForm from "@/components/LoginForm";
import { useSessionAuth } from "@/hooks/useSessionAuth";
import { setIn, pushIn, removeIn } from "@/lib/set-in";
import { ICONS } from "@/lib/icons";
import { API_ROUTES } from "@/lib/routes";
import type { SiteConfig } from "@/types/site-config";

type ConfigState = "loading" | "ready" | "not-found" | "error";

const DEFAULT_TEXT_SECTION = {
  heading: "",
  paragraph: "",
  bgColor: "#ffffff",
  textColor: "#000000",
  buttonText: "",
  buttonLink: "",
  className: "",
  boldText: "",
};

export default function AdminPanel() {
  const { authenticated, loading: authLoading, login, logout } = useSessionAuth();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [configState, setConfigState] = useState<ConfigState>("loading");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authenticated) return;

    setConfigState("loading");
    axios
      .get(API_ROUTES.siteConfig)
      .then((res) => {
        const loaded: SiteConfig = res.data.data;
        // Normalize optional blocks that older documents may not have, so the
        // editor always has something to bind to.
        if (!loaded.video) loaded.video = { url: "", title: "", description: "" };
        setConfig(loaded);
        setConfigState("ready");
      })
      .catch((err) => {
        setConfigState(err?.response?.status === 404 ? "not-found" : "error");
      });
  }, [authenticated]);

  const updateField = (path: string[], value: unknown) => {
    setConfig((prev) => (prev ? setIn(prev, path, value) : prev));
  };

  const addItem = (path: string[], item: unknown) => {
    setConfig((prev) => (prev ? pushIn(prev, path, item) : prev));
  };

  const removeItem = (path: string[], index: number) => {
    setConfig((prev) => (prev ? removeIn(prev, path, index) : prev));
  };

  if (authLoading) return <div className="p-4">Loading...</div>;

  if (!authenticated) {
    return <LoginForm onSubmit={login} />;
  }

  if (configState === "loading") return <div className="p-4">Loading config...</div>;

  if (configState === "not-found") {
    return (
      <div className="p-4">
        No site configuration exists yet. Run <code>npm run seed</code> to create the initial
        configuration.
      </div>
    );
  }

  if (configState === "error" || !config) {
    return (
      <div className="p-4">
        Failed to load site config. Check the server/database and try refreshing.
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    try {
      await axios.post(API_ROUTES.siteConfig, config);
      alert("Config saved successfully!");
    } catch {
      alert("Failed to save config.");
    } finally {
      setSaving(false);
    }
  };

  const mobileImage = config.hero.mobile[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Panel</h2>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Meta */}
      <section className="border p-4 rounded shadow space-y-3">
        <h3 className="font-bold text-lg">Meta</h3>
        <label htmlFor="meta-name" className="font-medium">
          Website Name
        </label>
        <input
          id="meta-name"
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
        <label htmlFor="meta-logo-alt" className="font-medium">
          Logo Alt Text (optional)
        </label>
        <input
          id="meta-logo-alt"
          placeholder="Alt Text"
          value={config.meta.logo.alt || ""}
          onChange={(e) => updateField(["meta", "logo", "alt"], e.target.value)}
          className="border p-2 w-full rounded"
        />
      </section>

      {/* Contact */}
      <section className="border p-4 rounded shadow space-y-3">
        <h3 className="font-bold text-lg">Contact</h3>
        <label htmlFor="contact-phone" className="font-medium">
          Phone Number
        </label>
        <input
          id="contact-phone"
          placeholder="Phone Number"
          value={config.contact.phone}
          onChange={(e) => updateField(["contact", "phone"], e.target.value)}
          className="border p-2 w-full rounded"
        />
        <label htmlFor="contact-whatsapp-url" className="font-medium">
          WhatsApp URL
        </label>
        <input
          id="contact-whatsapp-url"
          placeholder="WhatsApp URL"
          value={config.contact.whatsapp.url}
          onChange={(e) => updateField(["contact", "whatsapp", "url"], e.target.value)}
          className="border p-2 w-full rounded"
        />
        <label htmlFor="contact-whatsapp-label" className="font-medium">
          WhatsApp Label
        </label>
        <input
          id="contact-whatsapp-label"
          placeholder="WhatsApp Label"
          value={config.contact.whatsapp.label}
          onChange={(e) => updateField(["contact", "whatsapp", "label"], e.target.value)}
          className="border p-2 w-full rounded"
        />
      </section>

      {/* Hero */}
      <section className="border p-4 rounded shadow space-y-4">
        <h3 className="font-bold text-lg">Hero Section</h3>
        <label htmlFor="hero-interval" className="font-medium">
          Interval (ms)
        </label>
        <input
          id="hero-interval"
          type="number"
          min={500}
          placeholder="Interval"
          value={config.hero.interval ?? 2500}
          onChange={(e) =>
            updateField(["hero", "interval"], Math.max(500, Number(e.target.value) || 2500))
          }
          className="border p-2 w-32 rounded"
        />

        {/* Mobile Image */}
        <div className="space-y-2">
          <label className="font-medium">Mobile Image</label>
          {mobileImage ? (
            <>
              <ImageInput
                src={mobileImage.src}
                alt={mobileImage.alt || ""}
                onChange={(newSrc) => updateField(["hero", "mobile", "0", "src"], newSrc)}
                placeholder="Upload Mobile Image"
              />
              <div className="flex gap-2 items-center">
                <input
                  aria-label="Mobile image alt text"
                  placeholder="Alt Text (optional)"
                  value={mobileImage.alt || ""}
                  onChange={(e) => updateField(["hero", "mobile", "0", "alt"], e.target.value)}
                  className="border p-2 flex-1 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeItem(["hero", "mobile"], 0)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => addItem(["hero", "mobile"], { src: "", alt: "" })}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Mobile Image
            </button>
          )}
        </div>

        {/* Desktop Images */}
        <div className="space-y-3">
          <label className="font-medium">Desktop Images</label>
          {config.hero.desktop.map((img, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0"
            >
              <ImageInput
                src={img.src}
                alt={img.alt || ""}
                onChange={(newSrc) =>
                  updateField(["hero", "desktop", idx.toString(), "src"], newSrc)
                }
                placeholder="Upload Desktop Image"
              />
              <input
                aria-label={`Desktop image ${idx + 1} alt text`}
                placeholder="Alt Text (optional)"
                value={img.alt || ""}
                onChange={(e) =>
                  updateField(["hero", "desktop", idx.toString(), "alt"], e.target.value)
                }
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

      {/* Video (Google Drive) */}
      <section className="border p-4 rounded shadow space-y-3">
        <h3 className="font-bold text-lg">Landing Video</h3>
        <p className="text-sm text-gray-500">
          Paste a Google Drive share link (Anyone with the link → Viewer). It is embedded on the
          landing page with a YouTube-style player.
        </p>
        <label htmlFor="video-url" className="font-medium">
          Google Drive Link
        </label>
        <input
          id="video-url"
          placeholder="https://drive.google.com/file/d/.../view"
          value={config.video?.url ?? ""}
          onChange={(e) => updateField(["video", "url"], e.target.value)}
          className="border p-2 w-full rounded"
        />
        <label htmlFor="video-title" className="font-medium">
          Title
        </label>
        <input
          id="video-title"
          placeholder="e.g. Welcome to our Vidyapeeth"
          value={config.video?.title ?? ""}
          onChange={(e) => updateField(["video", "title"], e.target.value)}
          className="border p-2 w-full rounded"
        />
        <label htmlFor="video-description" className="font-medium">
          Description (optional)
        </label>
        <textarea
          id="video-description"
          placeholder="A short line shown under the video"
          value={config.video?.description ?? ""}
          onChange={(e) => updateField(["video", "description"], e.target.value)}
          className="border p-2 w-full rounded"
          rows={2}
        />
      </section>

      {/* Navigation */}
      <section className="border p-4 rounded shadow space-y-3">
        <h3 className="font-bold text-lg">Navigation</h3>
        {config.navigation.map((nav, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0"
          >
            <label htmlFor={`nav-label-${idx}`} className="font-medium w-full sm:w-auto">
              Label
            </label>
            <input
              id={`nav-label-${idx}`}
              placeholder="Label"
              value={nav.label}
              onChange={(e) => updateField(["navigation", idx.toString(), "label"], e.target.value)}
              className="border p-2 w-full sm:w-1/4 rounded"
            />
            <label htmlFor={`nav-href-${idx}`} className="font-medium w-full sm:w-auto">
              Href
            </label>
            <input
              id={`nav-href-${idx}`}
              placeholder="Href"
              value={nav.href}
              onChange={(e) => updateField(["navigation", idx.toString(), "href"], e.target.value)}
              className="border p-2 w-full sm:w-1/4 rounded"
            />
            <label htmlFor={`nav-icon-${idx}`} className="font-medium w-full sm:w-auto">
              Icon
            </label>
            <select
              id={`nav-icon-${idx}`}
              value={nav.icon || ""}
              onChange={(e) => updateField(["navigation", idx.toString(), "icon"], e.target.value)}
              className="border p-2 w-full sm:w-1/4 rounded"
            >
              <option value="">None</option>
              {Object.keys(ICONS).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={nav.external || false}
                onChange={(e) =>
                  updateField(["navigation", idx.toString(), "external"], e.target.checked)
                }
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

      {/* Text Sections */}
      <section className="border p-4 rounded shadow space-y-3">
        <h3 className="font-bold text-lg">Text Sections</h3>
        {config.textSections.map((sec, idx) => (
          <div key={idx} className="border p-3 rounded space-y-2 relative bg-gray-50">
            <button
              onClick={() => removeItem(["textSections"], idx)}
              aria-label="Remove section"
              className="absolute top-2 right-2 text-red-600 font-bold"
            >
              ×
            </button>

            <label className="block">
              Heading:
              <input
                type="text"
                value={sec.heading || ""}
                onChange={(e) =>
                  updateField(["textSections", idx.toString(), "heading"], e.target.value)
                }
                className="border p-2 w-full rounded mt-1"
              />
            </label>

            <label className="block">
              Bold Text:
              <input
                type="text"
                value={sec.boldText || ""}
                onChange={(e) =>
                  updateField(["textSections", idx.toString(), "boldText"], e.target.value)
                }
                className="border p-2 w-full rounded mt-1"
              />
            </label>

            <label className="block">
              Paragraph:
              <textarea
                value={sec.paragraph || ""}
                onChange={(e) =>
                  updateField(["textSections", idx.toString(), "paragraph"], e.target.value)
                }
                className="border p-2 w-full rounded mt-1"
                rows={3}
              />
            </label>

            <div className="flex gap-4 mt-2 flex-wrap">
              <label>
                Background Color:
                <input
                  type="color"
                  value={sec.bgColor || "#ffffff"}
                  onChange={(e) =>
                    updateField(["textSections", idx.toString(), "bgColor"], e.target.value)
                  }
                  className="ml-2 w-12 h-8 p-0 border-none"
                />
              </label>

              <label>
                Text Color:
                <input
                  type="color"
                  value={sec.textColor || "#000000"}
                  onChange={(e) =>
                    updateField(["textSections", idx.toString(), "textColor"], e.target.value)
                  }
                  className="ml-2 w-12 h-8 p-0 border-none"
                />
              </label>
            </div>

            <label className="block mt-2">
              Button Text:
              <input
                type="text"
                value={sec.buttonText || ""}
                onChange={(e) =>
                  updateField(["textSections", idx.toString(), "buttonText"], e.target.value)
                }
                className="border p-2 w-full rounded mt-1"
              />
            </label>

            <label className="block">
              Button Link:
              <input
                type="text"
                value={sec.buttonLink || ""}
                onChange={(e) =>
                  updateField(["textSections", idx.toString(), "buttonLink"], e.target.value)
                }
                className="border p-2 w-full rounded mt-1"
              />
            </label>

            <label className="block">
              Custom Class:
              <input
                type="text"
                value={sec.className || ""}
                onChange={(e) =>
                  updateField(["textSections", idx.toString(), "className"], e.target.value)
                }
                className="border p-2 w-full rounded mt-1"
              />
            </label>
          </div>
        ))}

        <button
          onClick={() => addItem(["textSections"], DEFAULT_TEXT_SECTION)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          + Add Text Section
        </button>
      </section>

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 bg-green-500 text-white px-6 py-3 rounded text-lg disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Config"}
      </button>
    </div>
  );
}
