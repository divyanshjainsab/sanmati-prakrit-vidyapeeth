import Hero from "@/components/Hero";
import TextSection from "@/components/TextSection";
import VideoSection from "@/components/sections/VideoSection";
import GalleryPreview from "@/components/sections/GalleryPreview";
import { getRequestSiteConfig } from "@/lib/request-config";

export default async function Home() {
  const { tenant, site } = await getRequestSiteConfig();

  return (
    <>
      <Hero hero={site.hero} />
      <TextSection />
      <VideoSection video={site.video} />
      <GalleryPreview tenant={tenant} />
    </>
  );
}
