import { SiteConfigProvider } from "@/context/SiteConfigContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getRequestSiteConfig } from "@/lib/request-config";

// Reads live, per-tenant data (resolved from the subdomain) on every request,
// so it can't be statically generated. An unprovisioned subdomain triggers
// notFound() inside getRequestSiteConfig → renders app/not-found.tsx.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { site } = await getRequestSiteConfig();

  return (
    <SiteConfigProvider value={site}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer site={site} />
      </div>
    </SiteConfigProvider>
  );
}
