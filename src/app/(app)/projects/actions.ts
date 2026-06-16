'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { canCreateProject } from '@/lib/permissions';
import { projectSchema, updateProjectSchema } from '@/lib/validation';
import { ActionResult } from '@/types';
import { Prisma } from '@prisma/client';

export async function createProject(formData: FormData): Promise<ActionResult> {
  // 1. Authenticate
  const session = await getSession();
  if (!session) {
    return { ok: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' } };
  }

  // 2. Authorize
  if (!canCreateProject(session.role)) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' } };
  }

  // 3. Validate Input
  const rawData = {
    projectName: formData.get('projectName') as string,
    projectCode: formData.get('projectCode') as string,
    description: formData.get('description') as string,
    location: formData.get('location') as string,
    startDate: formData.get('startDate') as string,
    expectedEndDate: formData.get('expectedEndDate') as string,
  };

  const validationResult = projectSchema.safeParse(rawData);
  if (!validationResult.success) {
    const firstIssue = validationResult.error.issues[0];
    return { ok: false, error: { code: 'BAD_REQUEST', message: firstIssue?.message ?? 'Please complete all required fields before submitting.' } };
  }

  const data = validationResult.data;

  // 4. Execute
  try {
    const project = await prisma.project.create({
      data: {
        projectName: data.projectName,
        projectCode: data.projectCode,
        description: data.description || null,
        location: data.location,
        startDate: new Date(data.startDate),
        expectedEndDate: new Date(data.expectedEndDate),
        assignedProjectManager: session.userId,
        createdBy: session.userId,
      },
    });

    revalidatePath('/projects');
    revalidatePath('/dashboard');
    
    return { ok: true, data: project.id };
  } catch (error) {
    console.error('Create project error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { ok: false, error: { code: 'CONFLICT', message: 'A project with this code already exists. Please choose a different code.' } };
      }
    }
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}

export async function updateProject(projectId: string, projectData: {
  projectName: string;
  description?: string;
  location: string;
  status: string;
  startDate: string;
  expectedEndDate: string;
}): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' } };
  }
  if (!canCreateProject(session.role)) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' } };
  }

  const validationResult = updateProjectSchema.safeParse(projectData);
  if (!validationResult.success) {
    const firstIssue = validationResult.error.issues[0];
    return { ok: false, error: { code: 'BAD_REQUEST', message: firstIssue?.message ?? 'Please complete all required fields correctly.' } };
  }

  const data = validationResult.data;

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { assignedProjectManager: true } });
    if (!project || project.assignedProjectManager !== session.userId) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' } };
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        projectName: data.projectName,
        description: data.description || null,
        location: data.location,
        status: data.status as any,
        startDate: new Date(data.startDate),
        expectedEndDate: new Date(data.expectedEndDate),
        updatedBy: session.userId,
      },
    });

    revalidatePath(`/projects/${projectId}`);
    revalidatePath('/projects');
    revalidatePath('/dashboard');

    return { ok: true };
  } catch (error) {
    console.error('Update project error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}
