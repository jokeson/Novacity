import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/shared/Container";
import { ROUTES } from "@/constants/routes";
import { uiSurfaceCard, uiTypography } from "@/lib/uiContext";
import { cn } from "@/lib/utils";

export type AuthPageViewProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export const AuthPageView = ({
  title,
  description,
  children,
  footer,
  className,
}: AuthPageViewProps) => {
  return (
    <div
      className={cn(
        "bg-muted/40 flex min-h-full flex-1 flex-col justify-center py-12 md:py-16",
        className,
      )}
    >
      <Container className="max-w-md">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <Link
            href={ROUTES.home}
            className="text-gold hover:text-gold/85 font-heading rounded-2xl text-xl font-semibold tracking-tight transition-all duration-300 focus-visible:ring-ring focus-visible:ring-3 focus-visible:outline-none"
          >
            Novacity
          </Link>
          <p className={uiTypography.body}>Secure access to the marketplace</p>
        </div>
        <Card className={cn(uiSurfaceCard, "shadow-md ring-border/60")}>
          <CardHeader>
            <CardTitle className={uiTypography.propertyTitle}>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer ? (
            <CardFooter className="flex flex-col gap-2 text-sm">
              {footer}
            </CardFooter>
          ) : null}
        </Card>
      </Container>
    </div>
  );
};
