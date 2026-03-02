import { redirect } from "next/navigation";
import { getServerSession, getServerUser } from "@/lib/auth-server";
import { SetPasswordForm } from "@/components/set-password-form";

export default async function SetPasswordPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // If user already has a non-default password set, send them to the dashboard
  const user = await getServerUser();
  const mustChangePassword = user?.user_metadata?.must_change_password;

  // Only block access if the flag is explicitly false (they already changed it)
  if (mustChangePassword === false) {
    redirect("/dashboard/overview");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SetPasswordForm />
      </div>
    </div>
  );
}
