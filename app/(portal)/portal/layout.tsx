import { PortalLayout } from "@/components/portal/PortalLayout";
import { UserRoleProvider } from "@/components/portal/UserRoleProvider";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function PortalPageLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  let role = null;
  let userName: string | null = null;
  let userEmail: string | null = null;

  if (authUser) {
    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { role: true, name: true, email: true },
    });
    role = dbUser?.role ?? null;
    userName = dbUser?.name ?? null;
    userEmail = dbUser?.email ?? authUser.email ?? null;
  }

  return (
    <UserRoleProvider role={role}>
      <PortalLayout userName={userName} userEmail={userEmail}>
        {children}
      </PortalLayout>
    </UserRoleProvider>
  );
}
