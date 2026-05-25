import { Container } from "@/components/shared/Container";
import { ROUTES } from "@/constants/routes";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import {
  AdminOwnerVerificationFilterTabs,
  parseOwnerVerificationAdminListFilter,
} from "@/features/admin/components/AdminOwnerVerificationFilterTabs";
import { AdminOwnerVerificationRow } from "@/features/admin/components/AdminOwnerVerificationRow";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listOwnerVerificationApplicationsWithUsers } from "@/server/repositories/ownerVerification.repository";
import type { ApplicantNationality, OwnerIdDocumentType } from "@/types/ownerVerification";

export const metadata = {
  title: "Owner verifications — Admin",
};

type PageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

const asNationality = (raw: string): ApplicantNationality =>
  raw === "international" ? "international" : "south-sudanese";

const asIdDocumentType = (raw: string): OwnerIdDocumentType => {
  if (raw === "drivers_license" || raw === "passport" || raw === "national_id") {
    return raw;
  }
  return "national_id";
};

export default async function AdminOwnerVerificationsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = parseOwnerVerificationAdminListFilter(sp.status);
  const rows = await listOwnerVerificationApplicationsWithUsers(filter, 100);

  const emptyCopy =
    filter === "pending"
      ? "No pending applications."
      : filter === "all"
        ? "No applications in the database yet."
        : `No ${filter} applications.`;

  return (
    <>
      <AdminHeader
        title="Owner verifications"
        description="Review submitted owner applications and ID documents. Approve to unlock listing tools for individual accounts."
        backLink={{ href: ROUTES.admin, label: "Overview" }}
      />
      <Container className="py-8 md:py-10">
        <AdminOwnerVerificationFilterTabs current={filter} />
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">{emptyCopy}</p>
        ) : (
          <div className="border-border overflow-x-auto rounded-2xl border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">Account</TableHead>
                  <TableHead className="min-w-[220px]">Application</TableHead>
                  <TableHead>ID document</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[220px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const uid = row.userId as {
                    _id?: { toString?: () => string };
                    email?: string;
                    name?: string;
                  };
                  const email = typeof uid?.email === "string" ? uid.email : "";
                  const name = typeof uid?.name === "string" ? uid.name : "";
                  const status = row.status;
                  return (
                    <AdminOwnerVerificationRow
                      key={String(row._id)}
                      applicationId={String(row._id)}
                      applicationStatus={status}
                      applicantEmail={email}
                      applicantName={name}
                      fullName={String(row.fullName)}
                      phone={String(row.phone)}
                      residentialAddress={String(row.residentialAddress)}
                      postingState={String(row.postingState)}
                      applicantNationality={asNationality(String(row.applicantNationality))}
                      idDocumentType={asIdDocumentType(String(row.idDocumentType))}
                      idDocumentUrl={String(row.idDocumentUrl)}
                      rejectionReason={String(row.rejectionReason ?? "")}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Container>
    </>
  );
}
