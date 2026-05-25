import { uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export type SectionTitleProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: "start" | "center";
  headingId?: string;
  className?: string;
};

export const SectionTitle = ({
  title,
  eyebrow,
  description,
  align = "start",
  headingId,
  className,
}: SectionTitleProps) => {
  return (
    <header
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <p className={uiTypography.eyebrow}>{eyebrow}</p> : null}
      <h2 id={headingId} className={uiTypography.sectionTitle}>
        {title}
      </h2>
      {description ? (
        <p className={cn(uiTypography.body, "max-w-2xl")}>{description}</p>
      ) : null}
    </header>
  );
};
