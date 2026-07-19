/**
 * A small inline lotus/mandala divider — a nod to Jain visual tradition,
 * drawn as self-contained SVG (no external asset). Decorative only.
 */
export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-saffron-500 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px w-8 bg-current opacity-40" />
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M12 2c1.4 1.8 2.1 3.6 2.1 5.4 0 1-.3 2-.9 3 1-.5 2-.8 3-.8 1.8 0 3.6.7 5.4 2.1-1.8 1.4-3.6 2.1-5.4 2.1-1 0-2-.3-3-.9.6 1 .9 2 .9 3 0 1.8-.7 3.6-2.1 5.4-1.4-1.8-2.1-3.6-2.1-5.4 0-1 .3-2 .9-3-1 .6-2 .9-3 .9-1.8 0-3.6-.7-5.4-2.1 1.8-1.4 3.6-2.1 5.4-2.1 1 0 2 .3 3 .8-.6-1-.9-2-.9-3C9.9 5.6 10.6 3.8 12 2z"
          fill="currentColor"
          opacity="0.85"
        />
        <circle cx="12" cy="12" r="1.6" fill="#7c2d12" />
      </svg>
      <span className="h-px w-8 bg-current opacity-40" />
    </span>
  );
}
