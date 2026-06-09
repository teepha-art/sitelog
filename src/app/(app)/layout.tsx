import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/AppShell';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/auth');
  }

  // Fetch the user for the topbar
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { fullName: true, role: true, profileImageUrl: true },
  });

  if (!user) {
    redirect('/auth');
  }

  return (
    <AppShell userRole={user.role} userName={user.fullName} userProfileImageUrl={user.profileImageUrl}>
      {children}
    </AppShell>
  );
}
