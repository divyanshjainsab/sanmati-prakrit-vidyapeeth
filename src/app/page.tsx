import Hero from "@/components/Hero";
import TextSection from "@/components/TextSection";
import { getSiteConfig } from "@/lib/site-config";

export default async function Home() {
  const site = await getSiteConfig();

  return (
    <>
      <Hero hero={site.hero} />
      <TextSection />
    </>
  );
}
