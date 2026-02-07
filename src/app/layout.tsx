import "./globals.css";
import { getSiteConfig } from "@/lib/site-config";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import Navbar from "@/components/layout/Navbar";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteConfig();

  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <SiteConfigProvider value={site}>
          <Navbar />
          <main>{children}</main>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
