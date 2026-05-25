import { Container } from "@/components/shared/Container";
import { ROUTES } from "@/constants/routes";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { AdminHomeHeroForm } from "@/features/admin/components/AdminHomeHeroForm";
import { getPublicHomeHeroResolved } from "@/server/queries/homeHero.queries";

export const metadata = {
  title: "Home hero — Admin",
};

export default async function AdminHomeHeroPage() {
  const initialValues = await getPublicHomeHeroResolved();

  return (
    <>
      <AdminHeader
        title="Homepage hero"
        description="Edit the headline, supporting copy, and hero image visitors see at the top of the public home page."
        backLink={{ href: ROUTES.admin, label: "Overview" }}
      />
      <Container className="py-8 md:py-10">
        <AdminHomeHeroForm initialValues={initialValues} />
      </Container>
    </>
  );
}
