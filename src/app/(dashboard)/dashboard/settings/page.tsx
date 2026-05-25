import { Container } from "@/components/shared/Container";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { SettingsPageView } from "@/features/dashboard/components/SettingsPageView";
import { ROUTES } from "@/constants/routes";
import { requireVerifiedOwnerForDashboard } from "@/features/verification/services/requireVerifiedOwnerDashboard";
import { requireSessionForDashboard } from "@/server/auth/session";
import { getUserByIdLean } from "@/server/queries/user.queries";

export const metadata = {
  title: "Settings",
};

export default async function DashboardSettingsPage() {
  const session = await requireVerifiedOwnerForDashboard();
  const user = await getUserByIdLean(session.sub);

  return (
    <>
      <DashboardHeader
        title="Settings"
        backLink={{ href: ROUTES.dashboard, label: "Back to overview" }}
        description="Update your profile photo below. Other profile fields and security controls will arrive in a later phase."
      />
      <Container className="py-8 md:py-10">
        <SettingsPageView
          name={typeof user?.name === "string" ? user.name : ""}
          email={session.email}
          phone={typeof user?.phone === "string" ? user.phone : ""}
          image={typeof user?.image === "string" ? user.image : ""}
          role={session.role}
        />
      </Container>
    </>
  );
}
