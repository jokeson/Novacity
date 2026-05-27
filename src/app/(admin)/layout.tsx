import { requireSessionForAdmin } from "@/server/auth/session";

export default async function AdminGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireSessionForAdmin();
  return children;
}
