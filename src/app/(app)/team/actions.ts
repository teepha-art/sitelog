'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { ActionResult } from '@/types';
import { revalidatePath } from 'next/cache';

export async function removeFromTeam(userId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Unauthorised' } };
  }

  const supervisor = await prisma.user.findUnique({
    where: { id: userId },
    select: { managerId: true, role: true },
  });

  if (!supervisor || supervisor.role !== Role.site_supervisor || supervisor.managerId !== session.userId) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'This user is not a member of your team.' } };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.projectMembership.deleteMany({
        where: {
          userId,
          project: { assignedProjectManager: session.userId },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { managerId: null },
      });
    });

    revalidatePath('/team');
    return { ok: true };
  } catch (error) {
    console.error('Remove from team error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}
