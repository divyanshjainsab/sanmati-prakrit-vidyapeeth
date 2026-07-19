"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

type Tenant = {
  slug: string;
  name: string;
  adminUsername: string;
  enabled: boolean;
  createdAt?: string;
};

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";

export default function SuperAdminPage() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // create form
  const [form, setForm] = useState({ slug: "", name: "", username: "", password: "" });

  // shared platform footer (common to all tenants)
  const [settings, setSettings] = useState({ copyright: "", enrollNote: "" });

  const loadTenants = useCallback(async () => {
    const res = await axios.get("/api/superadmin/tenants");
    setTenants(res.data.data);
  }, []);

  useEffect(() => {
    axios
      .get("/api/superadmin/session")
      .then((res) => setAuthed(Boolean(res.data?.data?.authenticated)))
      .catch(() => setAuthed(false))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    loadTenants().catch(() => setError("Failed to load tenants"));
    axios
      .get("/api/superadmin/settings")
      .then((res) => setSettings(res.data.data))
      .catch(() => {});
  }, [authed, loadTenants]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await axios.post("/api/superadmin/login", { username, password });
      setAuthed(true);
      setPassword("");
    } catch {
      setError("Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await axios.post("/api/superadmin/logout");
    setAuthed(false);
    setTenants([]);
  };

  const withBusy = async (fn: () => Promise<void>) => {
    setError(null);
    setBusy(true);
    try {
      await fn();
      await loadTenants();
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(msg || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const createTenant = (e: React.FormEvent) => {
    e.preventDefault();
    void withBusy(async () => {
      await axios.post("/api/superadmin/tenants", form);
      setForm({ slug: "", name: "", username: "", password: "" });
    });
  };

  const toggleEnabled = (t: Tenant) =>
    withBusy(async () => {
      await axios.patch(`/api/superadmin/tenants/${t.slug}`, { enabled: !t.enabled });
    });

  const resetPassword = (t: Tenant) => {
    const next = window.prompt(`New password for "${t.slug}" (min 6 chars):`);
    if (!next) return;
    void withBusy(async () => {
      await axios.patch(`/api/superadmin/tenants/${t.slug}`, { password: next });
    });
  };

  const removeTenant = (t: Tenant) => {
    if (!window.confirm(`Delete tenant "${t.slug}" and all its content? This cannot be undone.`))
      return;
    void withBusy(async () => {
      await axios.delete(`/api/superadmin/tenants/${t.slug}`);
    });
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await axios.patch("/api/superadmin/settings", settings);
      setSettings(res.data.data);
    } catch {
      setError("Failed to save footer");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-8 text-maroon-800">Loading…</div>;

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm space-y-4 rounded-xl border border-saffron-200 bg-white p-6 shadow"
        >
          <h1 className="font-serif text-2xl font-bold text-maroon-800">Super Admin</h1>
          <input
            aria-label="Username"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border p-2"
          />
          <input
            aria-label="Password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2"
          />
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="w-full rounded bg-maroon-800 py-2 font-semibold text-cream hover:bg-maroon-900 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-maroon-800">Tenant Fleet</h1>
        <button
          onClick={logout}
          className="rounded bg-maroon-800 px-4 py-2 text-sm text-cream hover:bg-maroon-900"
        >
          Logout
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Create */}
      <section className="rounded-xl border border-saffron-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-maroon-800">Create tenant</h2>
        <form onSubmit={createTenant} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            aria-label="Subdomain slug"
            placeholder="slug (subdomain)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded border p-2"
          />
          <input
            aria-label="Display name"
            placeholder="Display name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded border p-2"
          />
          <input
            aria-label="Admin username"
            placeholder="Admin username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="rounded border p-2"
          />
          <input
            aria-label="Admin password"
            type="password"
            placeholder="Admin password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded border p-2"
          />
          <button
            disabled={busy}
            className="rounded bg-saffron-600 px-4 py-2 font-semibold text-white hover:bg-saffron-700 disabled:opacity-50"
          >
            Create
          </button>
        </form>
      </section>

      {/* Shared footer (all tenants) */}
      <section className="rounded-xl border border-saffron-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-maroon-800">Shared footer</h2>
        <p className="mb-3 text-xs text-maroon-700/70">Shown at the bottom of every tenant site.</p>
        <form onSubmit={saveSettings} className="space-y-3">
          <div>
            <label htmlFor="pf-enroll" className="mb-1 block text-sm font-medium text-maroon-800">
              Enrollment / contact note
            </label>
            <textarea
              id="pf-enroll"
              rows={2}
              value={settings.enrollNote}
              onChange={(e) => setSettings({ ...settings, enrollNote: e.target.value })}
              placeholder="Admissions open — call +91-… or email admissions@…"
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label htmlFor="pf-copy" className="mb-1 block text-sm font-medium text-maroon-800">
              Copyright line
            </label>
            <input
              id="pf-copy"
              value={settings.copyright}
              onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
              placeholder="© 2026 Sanmati Prakrit Vidyapeeth Trust"
              className="w-full rounded border p-2"
            />
          </div>
          <button
            disabled={busy}
            className="rounded bg-saffron-600 px-4 py-2 font-semibold text-white hover:bg-saffron-700 disabled:opacity-50"
          >
            Save footer
          </button>
        </form>
      </section>

      {/* Fleet table */}
      <section className="overflow-x-auto rounded-xl border border-saffron-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-saffron-50 text-maroon-800">
            <tr>
              <th className="p-3">Site</th>
              <th className="p-3">Admin</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-maroon-700/70">
                  No tenants yet.
                </td>
              </tr>
            )}
            {tenants.map((t) => (
              <tr key={t.slug} className="border-t border-saffron-100">
                <td className="p-3">
                  <div className="font-medium text-maroon-900">{t.name}</div>
                  <a
                    href={`//${t.slug}.${ROOT_DOMAIN}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-saffron-700 hover:underline"
                  >
                    {t.slug}.{ROOT_DOMAIN}
                  </a>
                </td>
                <td className="p-3 text-maroon-800">{t.adminUsername}</td>
                <td className="p-3">
                  <span
                    className={
                      t.enabled
                        ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                        : "rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700"
                    }
                  >
                    {t.enabled ? "Active" : "Suspended"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button
                      disabled={busy}
                      onClick={() => toggleEnabled(t)}
                      className="rounded border border-maroon-800 px-2 py-1 text-xs text-maroon-800 hover:bg-saffron-50 disabled:opacity-50"
                    >
                      {t.enabled ? "Suspend" : "Activate"}
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => resetPassword(t)}
                      className="rounded border border-maroon-800 px-2 py-1 text-xs text-maroon-800 hover:bg-saffron-50 disabled:opacity-50"
                    >
                      Reset password
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => removeTenant(t)}
                      className="rounded border border-red-600 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
