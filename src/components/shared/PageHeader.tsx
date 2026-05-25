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
    <div className={cn(uiPageHeaderShell, className)}>
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h1 className={uiTypography.pageTitle}>{title}</h1>
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
