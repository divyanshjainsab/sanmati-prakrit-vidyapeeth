"use client";

import { useState } from "react";

type VideoEmbedProps = {
  embedUrl: string;
  thumbnailUrl: string | null;
  title: string;
  playLabel: string;
};

/**
 * A YouTube-style "lite embed" facade: shows a poster + big red play button,
 * and only loads the (Google Drive) iframe once the user clicks. Keeps the page
 * light and gives a familiar YouTube feel over a Drive-hosted video.
 */
export default function VideoEmbed({ embedUrl, thumbnailUrl, title, playLabel }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl ring-1 ring-black/10">
      {playing ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`${playLabel}: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- Drive thumbnails redirect across hosts; a plain img avoids next/image remote-pattern churn
            <img
              src={thumbnailUrl}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <span className="absolute inset-0 bg-gradient-to-br from-maroon-800 to-black" />
          )}

          <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/15" />

          {/* YouTube-style play button */}
          <span className="absolute left-1/2 top-1/2 flex h-14 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-red-600 shadow-lg transition group-hover:scale-110 group-hover:bg-red-700">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
