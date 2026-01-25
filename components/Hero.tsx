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

  // Auto-scroll desktop images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % desktopImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [desktopImages.length]);

  return (
    <section
      style={{
        height: "70vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "2vh", // tiny breathing room
      }}
    >
      {/* Wrapper controls size using vw/vh */}
      <div
        style={{
          width: "90vw",
          height: "70vh",
          position: "relative",
          overflow: "hidden",
          borderRadius: "12px",
        }}
      >
        {/* Desktop */}
        <div className="desktop">
          <Image
            src={desktopImages[currentIndex]}
            alt="Hero background"
            fill
            priority
            sizes="90vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Mobile */}
        <div className="mobile">
          <Image
            src={mobileImage}
            alt="Hero background"
            fill
            priority
            sizes="90vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <style jsx>{`
        .desktop {
          display: none;
        }
        .mobile {
          display: block;
        }

        @media (min-width: 768px) {
          .desktop {
            display: block;
          }
          .mobile {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
