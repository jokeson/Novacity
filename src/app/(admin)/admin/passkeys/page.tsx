import { Container } from "@/components/shared/Container";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { PassKeysTable } from "@/features/admin/components/PassKeysTable";
import type { AdminPassKeyRow } from "@/features/passkeys/components/AdminPassKeysTable";
import { buildPassKeyDashboardState } from "@/features/passkeys/services/buildPassKeyDashboardState";
import { ROUTES } from "@/constants/routes";
import { findUsersByIdsLean } from "@/server/queries/user.queries";
import { listPassKeysForAdmin } from "@/server/services/passkey.service";

export const metadata = {
  title: "Pass keys — Admin",
};

export default async function AdminPassKeysPage() {
  const keys = await listPassKeysForAdmin(200);
  const userIds = [
    ...new Set(
      keys
        .map((k) => (k.userId ? String(k.userId) : null))
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const users = await findUsersByIdsLean(userIds);
  const emailMap = new Map<string, string>();
  for (const u of users) {
    emailMap.set(String(u._id), typeof u.email === "string" ? u.email : "");
  }

  const lean = keys.map((doc) => ({
    _id: doc._id,
    code: doc.code,
    userId: doc.userId ?? null,
    duration: doc.duration,
    isActive: doc.isActive,
    expiresAt: doc.expiresAt,
    usedAt: doc.usedAt ?? null,
    createdAt: doc.createdAt,
  }));

  const state = buildPassKeyDashboardState(lean, emailMap);

  const rows: AdminPassKeyRow[] = state.keys.map((k) => ({
    id: k.id,
    code: k.code,
    assigneeEmail: k.assigneeEmail,
    duration: k.duration,
    isActive: k.isActive,
    expiresAt: k.expiresAt,
    usedAt: k.usedAt,
    createdAt: k.createdAt,
  }));

  return (
    <>
      <AdminHeader
        title="Pass keys"
        backLink={{ href: ROUTES.admin, label: "Back to admin" }}
        description="Generate pool or assigned keys, monitor usage, and deactivate or expire keys when needed. Owner accounts need a valid unused PassKey to publish; each first publish consumes one key."
      />
      <Container className="space-y-8 py-8 md:py-10">
        <PassKeysTable rows={rows} />
      </Container>
    </>
  );
}
