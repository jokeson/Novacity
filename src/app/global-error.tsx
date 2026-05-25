"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface unexpected root-level failures during development.
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="flex max-w-md flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A critical error occurred while rendering this page. You can try
            again — if the problem persists, contact support with the reference
            {error.digest ? ` ${error.digest}` : ""}.
          </p>
        </div>
        <button
          type="button"
          className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium shadow transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          onClick={() => {
            reset();
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
