import type { Metadata } from "next";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { I18nProvider } from "@/components/I18nProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getRequestContext } from "@/lib/request-context";
import { getPlatformSettings } from "@/lib/platform-settings";
import { SITE_DESCRIPTION } from "@/lib/site";

// Reads live, per-tenant data (resolved from the subdomain) on every request,
// so it can't be statically generated. An unprovisioned subdomain triggers
// notFound() inside getRequestSiteConfig → renders app/not-found.tsx.
export const dynamic = "force-dynamic";

// Per-tenant tab title (the tenant's own name, in the active locale) rather
// than the platform's static SITE_NAME.
export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getRequestContext();
  const name = site.meta.name;
  return {
    title: { default: name, template: `%s · ${name}` },
    description: SITE_DESCRIPTION,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ site, locale, messages }, platform] = await Promise.all([
    getRequestContext(),
    getPlatformSettings(),
  ]);

  return (
    <I18nProvider locale={locale} messages={messages}>
      <SiteConfigProvider value={site}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer site={site} messages={messages} platform={platform} />
        </div>
      </SiteConfigProvider>
    </I18nProvider>
  );
}
