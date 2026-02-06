"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const mobileImage = "/images/hero-moblie.jpeg";

  const desktopImages = Array.from(
    { length: 11 },
    (_, i) => `/images/hero-desktop/${i + 1}.jpeg`
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll desktop images (only matters on md+)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % desktopImages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [desktopImages.length]);

  return (
    <section className="flex h-[70vh] w-screen items-start justify-center pt-[2vh]">
      {/* Wrapper */}
      <div className="relative h-[70vh] w-[90vw] overflow-hidden rounded-xl">
        {/* Mobile image (default) */}
        <div className="block md:hidden">
          <Image
            src={mobileImage}
            alt="Hero background"
            fill
            priority
            sizes="90vw"
            className="object-cover"
          />
        </div>

        {/* Desktop slideshow (md+) */}
        <div className="hidden md:block">
          <Image
            src={desktopImages[currentIndex]}
            alt="Hero background"
            fill
            priority
            sizes="90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
