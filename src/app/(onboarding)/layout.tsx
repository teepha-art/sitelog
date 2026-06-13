import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/auth');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { onboardedAt: true, role: true },
  });

  if (user?.onboardedAt) {
    redirect(user.role === 'project_manager' ? '/dashboard' : '/projects');
  }

  return <>{children}</>;
}
