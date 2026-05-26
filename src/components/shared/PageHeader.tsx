import { uiPageHeaderShell, uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

import { Container } from "./Container";

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export const PageHeader = ({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn(uiPageHeaderShell, "min-w-0", className)}>
      <Container>
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
            <h1 className={cn(uiTypography.pageTitle, "text-2xl sm:text-3xl")}>
              {title}
            </h1>
            {description ? (
              <p className={cn(uiTypography.body, "max-w-2xl")}>{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
};
