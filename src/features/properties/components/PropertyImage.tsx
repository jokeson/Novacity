import Image from "next/image";

import { cn } from "@/lib/utils";

export type PropertyImageProps = {
  src: string;
  alt: string;
  /** LCP hint without `priority` (avoids hydration mismatch in client trees). */
  priority?: boolean;
  /** Same as priority for client-rendered galleries — uses eager + fetchPriority only. */
  eagerLoad?: boolean;
  sizes?: string;
  className?: string;
};

export const PropertyImage = ({
  src,
  alt,
  priority,
  eagerLoad = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px",
  className,
}: PropertyImageProps) => {
  const loadEager = Boolean(priority || eagerLoad);
  const useNextPriority = Boolean(priority) && !eagerLoad;

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-border",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={useNextPriority}
        loading={loadEager ? "eager" : "lazy"}
        fetchPriority={loadEager && !useNextPriority ? "high" : undefined}
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
};
