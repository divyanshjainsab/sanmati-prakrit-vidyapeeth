"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-4">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-gray-600">
            Please try again, or contact the site administrator if the problem persists.
          </p>
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
