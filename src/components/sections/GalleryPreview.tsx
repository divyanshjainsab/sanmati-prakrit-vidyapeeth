import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { getRecentImages } from "@/lib/gallery";
import { ROUTES } from "@/lib/routes";

export default async function GalleryPreview({ tenant }: { tenant: string }) {
  // Resilient: a gallery/DB hiccup should never take down the landing page.
  let images: Awaited<ReturnType<typeof getRecentImages>> = [];
  try {
    images = await getRecentImages(tenant, 8);
  } catch (err) {
    console.error("GalleryPreview: failed to load images", err);
  }

  if (images.length === 0) return null;

  return (
    <section className="w-full bg-gradient-to-b from-white to-saffron-50 px-5 py-16 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
        <SectionHeading
          eyebrow="Our Community"
          title="Glimpses of the Vidyapeeth"
          subtitle="Moments from our campus, ceremonies, and seva — a living record of our community's journey."
        />

        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, idx) => (
            <div
              key={img.publicId || idx}
              className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-saffron-200/60 shadow-sm"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>

        <Link
          href={ROUTES.gallery}
          className="rounded-full bg-maroon-800 px-8 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-maroon-900 hover:shadow-lg"
        >
          View full gallery
        </Link>
      </div>
    </section>
  );
}
