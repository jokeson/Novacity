import { Container } from "@/components/shared/Container";
import { ROUTES } from "@/constants/routes";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { UsersTable, type AdminUserRow } from "@/features/admin/components/UsersTable";
import { listUsersForAdmin } from "@/server/repositories/user.repository";
import type { UserRole } from "@/types/user";

export const metadata = {
  title: "Users — Admin",
};

export default async function AdminUsersPage() {
  const users = await listUsersForAdmin(250);

  const rows: AdminUserRow[] = users.map((u) => ({
    id: String(u._id),
    email: String(u.email),
    name: typeof u.name === "string" ? u.name : "",
    role: u.role as UserRole,
    suspended: u.suspendedAt != null,
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : "",
  }));

  return (
    <>
      <AdminHeader
        title="Users"
        description="Suspend accounts to block sign-in, or delete users who no longer own listings. Destructive actions require confirmation."
        backLink={{ href: ROUTES.admin, label: "Overview" }}
      />
      <Container className="py-8 md:py-10">
        <UsersTable rows={rows} />
      </Container>
    </>
  );
}
