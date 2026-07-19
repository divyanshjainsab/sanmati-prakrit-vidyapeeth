import Ornament from "@/components/ui/Ornament";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignment} gap-3`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-600">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl font-bold leading-tight text-maroon-800 sm:text-4xl">
        {title}
      </h2>
      <Ornament className={align === "center" ? "" : "self-start"} />
      {subtitle && (
        <p className="max-w-2xl text-base leading-relaxed text-maroon-700/80">{subtitle}</p>
      )}
    </div>
  );
}
