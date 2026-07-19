import VideoEmbed from "@/components/VideoEmbed";
import SectionHeading from "@/components/ui/SectionHeading";
import { getDriveEmbedUrl, getDriveThumbnailUrl } from "@/lib/video";
import type { SiteConfig } from "@/types/site-config";

export default function VideoSection({ video }: { video: SiteConfig["video"] }) {
  const embedUrl = getDriveEmbedUrl(video?.url);

  // Nothing to show until an admin adds a valid Google Drive link.
  if (!embedUrl) return null;

  const title = video?.title?.trim() || "Watch our story";
  const thumbnailUrl = getDriveThumbnailUrl(video?.url);

  return (
    <section className="w-full bg-cream px-5 py-16 sm:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
        <SectionHeading
          eyebrow="Our Vidyapeeth"
          title={title}
          subtitle={video?.description?.trim() || undefined}
        />
        <VideoEmbed embedUrl={embedUrl} thumbnailUrl={thumbnailUrl} title={title} />
      </div>
    </section>
  );
}
