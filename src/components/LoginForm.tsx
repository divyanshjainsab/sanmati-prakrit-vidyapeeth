"use client";

import { useState } from "react";

export type LoginLabels = {
  title: string;
  username: string;
  password: string;
  submit: string;
  submitting: string;
  invalid: string;
};

// English defaults so the form works outside the App Router i18n provider
// (e.g. the Pages Router admin panel). Callers with a locale pass `labels`.
const DEFAULT_LABELS: LoginLabels = {
  title: "Admin Login",
  username: "Username",
  password: "Password",
  submit: "Login",
  submitting: "Logging in…",
  invalid: "Invalid credentials",
};

type LoginFormProps = {
  onSubmit: (username: string, password: string) => Promise<boolean>;
  labels?: Partial<LoginLabels>;
};

export default function LoginForm({ onSubmit, labels }: LoginFormProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const ok = await onSubmit(username, password);
    if (!ok) setError(l.invalid);

    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 font-serif text-2xl font-bold text-maroon-800">{l.title}</h1>
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
        <label htmlFor="login-username" className="sr-only">
          {l.username}
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder={l.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded border p-2"
        />
        <label htmlFor="login-password" className="sr-only">
          {l.password}
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder={l.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border p-2"
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-maroon-800 py-2 font-semibold text-cream hover:bg-maroon-900 disabled:opacity-50"
        >
          {submitting ? l.submitting : l.submit}
        </button>
      </form>
    </div>
  );
}
