"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16">
      <p className="text-destructive text-center text-sm font-medium">
        Something went wrong in the admin area.
      </p>
      <Button type="button" variant="outline" className="cursor-pointer rounded-xl" onClick={reset}>
        Try again
      </Button>
    </Container>
  );
}
