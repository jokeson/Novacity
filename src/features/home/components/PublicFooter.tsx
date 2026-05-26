import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { footerNavItems } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";

export const PublicFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-border bg-primary text-primary-foreground min-w-0 border-t pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 lg:pt-16"
      aria-labelledby="footer-heading"
    >
      <Container>
        <div className="grid min-w-0 gap-8 sm:gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <h2 id="footer-heading" className="font-heading text-lg font-semibold">
              Novacity
            </h2>
            <p className="text-primary-foreground/80 max-w-xs text-sm leading-relaxed">
              A modern real estate marketplace pairing elegant software with
              human expertise.
            </p>
          </div>
          <div>
            <p className="text-gold mb-3 text-xs font-semibold uppercase tracking-widest">
              Explore
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={ROUTES.properties}
                  className="text-primary-foreground/90 hover:text-gold cursor-pointer text-sm transition-colors duration-300"
                >
                  Browse properties
                </Link>
              </li>
              <li>
                <Link
                  href="#states"
                  className="text-primary-foreground/90 hover:text-gold cursor-pointer text-sm transition-colors duration-300"
                >
                  States
                </Link>
              </li>
              <li>
                <Link
                  href="#company"
                  className="text-primary-foreground/90 hover:text-gold cursor-pointer text-sm transition-colors duration-300"
                >
                  Company
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-gold mb-3 text-xs font-semibold uppercase tracking-widest">
              Account
            </p>
            <ul className="flex flex-col gap-2">
              {footerNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-primary-foreground/90 hover:text-gold text-sm transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES.dashboard}
                  className="text-primary-foreground/90 hover:text-gold text-sm transition-colors duration-300"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest">
              Contact
            </p>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              hello@novacity.example
              <br />
              Available daily 8am – 8pm Eastern
            </p>
          </div>
        </div>
        <div className="border-primary-foreground/15 mt-14 border-t pt-8 text-center text-xs text-primary-foreground/60 sm:text-start">
          © {year} Novacity. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};
