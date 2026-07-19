import "./globals.css";
import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

// Plain default title (no template) so it doesn't wrap the per-tenant titles
// set by the (site) layout's generateMetadata. Applies only to non-tenant
// routes (super-admin, not-found).
export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

// Minimal, resilient root layout — it does NOT load tenant data, so an
// unprovisioned subdomain (which calls notFound() in the (site) layout) can
// still render not-found.tsx inside this shell with a 404 status.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden bg-cream text-maroon-900">{children}</body>
    </html>
  );
}
