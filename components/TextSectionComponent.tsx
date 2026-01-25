"use client";

import { useRouter } from "next/navigation";

type TextSectionProps = {
  heading: string;
  paragraph: string;
  bgColor?: string; // optional background color
  textColor?: string; // optional text color
  buttonText?: string; // optional button text
  buttonLink?: string; // optional link for the button
  className?: string;
  boldText?: string
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

  const handleButtonClick = () => {
    if (buttonLink) {
      router.push(buttonLink);
    }
  };

  return (
    <section
      className={className}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "10px 20px",
        textAlign: "center",
        lineHeight: "1.6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "12px",
          maxWidth: "800px",
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          fontSize: "1.2rem",
          maxWidth: "700px",
          marginBottom: buttonText ? "32px" : "0",
          color: textColor,
        }}
      >
        {paragraph}
      </p>
      {boldText && (
        <p style={{ fontSize: "24px", color: "green" }}>
          <b>{boldText}</b>
        </p>
      )}

      {buttonText && buttonLink && (
        <button
          onClick={handleButtonClick}
          style={{
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            padding: "12px 28px",
            fontSize: "1rem",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#005bb5")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#0070f3")
          }
        >
          {buttonText}
        </button>
      )}
    </section>
  );
}
