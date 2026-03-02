import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireAuth, getServerUser } from "@/lib/auth-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  // Prevent users with the default password from accessing the dashboard
  const user = await getServerUser();
  if (user?.user_metadata?.must_change_password === true) {
    redirect("/set-password");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
