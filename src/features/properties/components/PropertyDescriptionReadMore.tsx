"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";

import { uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "The owner has not added a description yet.";

export type PropertyDescriptionReadMoreProps = {
  description: string;
  className?: string;
};

export const PropertyDescriptionReadMore = ({
  description,
  className,
}: PropertyDescriptionReadMoreProps) => {
  const descriptionId = useId();
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isTruncatable, setIsTruncatable] = useState(false);

  const trimmed = description?.trim() ?? "";
  const text = trimmed || PLACEHOLDER;
  const isPlaceholder = trimmed.length === 0;

  const measureTruncation = useCallback(() => {
    const el = contentRef.current;
    if (!el || isPlaceholder || expanded) {
      return;
    }
    setIsTruncatable(el.scrollHeight > el.clientHeight + 1);
  }, [expanded, isPlaceholder]);

  useLayoutEffect(() => {
    measureTruncation();
  }, [measureTruncation]);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el || isPlaceholder) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      measureTruncation();
    });
    resizeObserver.observe(el);
    window.addEventListener("resize", measureTruncation);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureTruncation);
    };
  }, [isPlaceholder, measureTruncation]);

  const handleToggle = (): void => {
    setExpanded((prev) => !prev);
  };

  const showToggle = isTruncatable && !isPlaceholder;

  return (
    <div className={cn("space-y-2", className)}>
      <p
        id={descriptionId}
        ref={contentRef}
        className={cn(
          uiTypography.body,
          "whitespace-pre-line md:text-base",
          !expanded && "line-clamp-3",
        )}
      >
        {text}
      </p>
      {showToggle ? (
        <button
          type="button"
          className="text-gold hover:text-gold/85 cursor-pointer text-sm font-semibold underline-offset-4 hover:underline focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none"
          aria-expanded={expanded}
          aria-controls={descriptionId}
          onClick={handleToggle}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
};
