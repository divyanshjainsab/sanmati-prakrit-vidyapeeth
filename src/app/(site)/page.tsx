import Hero from "@/components/Hero";
import TextSection from "@/components/TextSection";
import VideoSection from "@/components/sections/VideoSection";
import GalleryPreview from "@/components/sections/GalleryPreview";
import { getRequestContext } from "@/lib/request-context";

export default async function Home() {
  const { tenant, site, messages } = await getRequestContext();

  return (
    <>
      <Hero hero={site.hero} />
      <TextSection />
      <VideoSection video={site.video} messages={messages} />
      <GalleryPreview tenant={tenant} messages={messages} />
    </>
  );
}
