"use client";

import TextSectionComponent from "@/components/TextSectionComponent";
import { useSiteConfig } from "@/context/SiteConfigContext";
import type { SiteConfig } from "@/types/site-config";

type TextSectionItem = SiteConfig["textSections"][number];

export default function TextSection() {
  const { textSections } = useSiteConfig() as SiteConfig;

  if (!textSections?.length) return null;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-5xl px-4 py-12 flex flex-col gap-12">
        {textSections.map((section: TextSectionItem, index: number) => (
          <TextSectionComponent
            key={index}
            heading={section.heading}
            paragraph={section.paragraph}
            bgColor={section.bgColor}
            textColor={section.textColor}
            boldText={section.boldText}
            buttonText={section.buttonText}
            buttonLink={section.buttonLink}
          />
        ))}
      </div>
    </section>
  );
}
