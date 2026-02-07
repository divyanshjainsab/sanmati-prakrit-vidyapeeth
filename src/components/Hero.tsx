"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero({ hero }: { hero: any }) {
  if (!hero) return null;

  const {
    mobile = [],
    desktop = [],
    interval = 2500
  } = hero;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!desktop.length) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % desktop.length);
    }, interval);

    return () => clearInterval(id);
  }, [desktop.length, interval]);

  return (
    <section className="w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative h-[65vh] rounded-xl overflow-hidden">
          {/* Mobile */}
          {mobile[0] && (
            <div className="absolute inset-0 md:hidden">
              <Image
                src={mobile[0].src}
                alt={mobile[0].alt || "Hero image"}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>
          )}

          {/* Desktop slideshow */}
          {desktop[index] && (
            <div className="absolute inset-0 hidden md:block">
              <Image
                src={desktop[index].src}
                alt="Hero image"
                fill
                priority
                sizes="1200px"
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
