import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { I18nProvider } from "@/components/I18nProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getRequestContext } from "@/lib/request-context";

// Reads live, per-tenant data (resolved from the subdomain) on every request,
// so it can't be statically generated. An unprovisioned subdomain triggers
// notFound() inside getRequestSiteConfig → renders app/not-found.tsx.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { site, locale, messages } = await getRequestContext();

  return (
    <I18nProvider locale={locale} messages={messages}>
      <SiteConfigProvider value={site}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer site={site} messages={messages} />
        </div>
      </SiteConfigProvider>
    </I18nProvider>
  );
}
