import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OnboardingFlow } from './OnboardingFlow';

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { fullName: true, role: true },
  });

  if (!user) return null;

  return <OnboardingFlow fullName={user.fullName} role={user.role} />;
}
