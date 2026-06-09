'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { ActionResult } from '@/types';
import { revalidatePath } from 'next/cache';

export async function searchSupervisors(query: string) {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) return [];

  if (!query || query.length < 2) return [];

  const users = await prisma.user.findMany({
    where: {
      role: Role.site_supervisor,
      isActive: true,
      OR: [
        { fullName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { id: true, fullName: true, email: true },
    take: 10,
  });

  return users;
}

export async function assignSupervisor(projectId: string, userId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Unauthorised' } };
  }

  // Ensure PM manages this project and get project name
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { assignedProjectManager: true, projectName: true }
  });

  if (project?.assignedProjectManager !== session.userId) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' } };
  }

  try {
    const existing = await prisma.projectMembership.findUnique({
      where: { projectId_userId: { projectId, userId } }
    });

    if (existing) {
      return { ok: false, error: { code: 'CONFLICT', message: 'This supervisor is already assigned to this project.' } };
    }

    await prisma.projectMembership.create({
      data: {
        projectId,
        userId,
        roleInProject: Role.site_supervisor,
      }
    });

    await prisma.notification.create({
      data: {
        recipientId: userId,
        type: 'assigned_to_project',
        message: `You've been assigned to ${project.projectName}.`,
        relatedEntityId: projectId,
        relatedEntityType: 'project',
      }
    });

    revalidatePath(`/projects/${projectId}`);
    return { ok: true };
  } catch (error) {
    console.error('Assign supervisor error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}

export async function removeSupervisor(projectId: string, userId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Unauthorised' } };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { assignedProjectManager: true }
  });

  if (project?.assignedProjectManager !== session.userId) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' } };
  }

  try {
    await prisma.projectMembership.delete({
      where: { projectId_userId: { projectId, userId } }
    });

    revalidatePath(`/projects/${projectId}`);
    return { ok: true };
  } catch (error) {
    console.error('Remove supervisor error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}
