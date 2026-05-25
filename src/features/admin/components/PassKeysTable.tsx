import { AdminPassKeyIssueForm } from "@/features/passkeys/components/AdminPassKeyIssueForm";
import { AdminPassKeysTable } from "@/features/passkeys/components/AdminPassKeysTable";
import type { AdminPassKeyRow } from "@/features/passkeys/components/AdminPassKeysTable";

export type PassKeysTableProps = {
  rows: AdminPassKeyRow[];
};

/** Admin-facing PassKey table + issue form (wraps passkeys feature UI). */
export const PassKeysTable = ({ rows }: PassKeysTableProps) => {
  return (
    <div className="space-y-8">
      <AdminPassKeyIssueForm />
      <AdminPassKeysTable rows={rows} />
    </div>
  );
};
