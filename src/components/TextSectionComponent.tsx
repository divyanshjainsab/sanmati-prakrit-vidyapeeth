"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";

type TextSectionProps = {
  heading: string;
  paragraph: string;
  bgColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
  boldText?: string;
};

export default function TextSection({
  heading,
  paragraph,
  bgColor = "white",
  textColor = "#111",
  buttonText,
  buttonLink,
  className = "",
  boldText = "",
}: TextSectionProps) {
  const router = useRouter();

  return (
    <section
      className={clsx(
        "flex flex-col items-center justify-center gap-6 px-5 py-10 text-center sm:px-8",
        className
      )}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Heading */}
      <h2
        className="
          max-w-3xl
          text-2xl font-bold
          leading-tight
          sm:text-3xl md:text-4xl
        "
      >
        {heading}
      </h2>

      {/* Paragraph */}
      <p
        className="
          max-w-3xl
          text-base leading-relaxed
          sm:text-lg
        "
      >
        {paragraph}
      </p>

      {/* Bold Highlight */}
      {boldText && (
        <p className="max-w-3xl text-lg font-semibold text-green-600 sm:text-xl">
          {boldText}
        </p>
      )}

      {/* Button */}
      {buttonText && buttonLink && (
        <button
          onClick={() => router.push(buttonLink)}
          className="
            mt-4
            rounded-lg
            bg-blue-600 px-8 py-3
            text-sm font-semibold text-white
            shadow-md
            transition
            hover:bg-blue-700 hover:shadow-lg
            active:scale-95
          "
        >
          {buttonText}
        </button>
      )}
    </section>
  );
}
