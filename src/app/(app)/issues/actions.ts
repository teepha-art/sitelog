'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { issueSchema } from '@/lib/validation';
import { ActionResult } from '@/types';
import { Role } from '@prisma/client';

export async function createIssue(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' } };
  }

  const rawData = {
    projectId: formData.get('projectId') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    priority: formData.get('priority') as string,
  };

  const validationResult = issueSchema.safeParse(rawData);
  if (!validationResult.success) {
    return { ok: false, error: { code: 'BAD_REQUEST', message: 'Please complete all required fields correctly.' } };
  }

  const data = validationResult.data;

  // Check access to project
  const hasAccess = await prisma.project.findFirst({
    where: {
      id: data.projectId,
      OR: [
        { assignedProjectManager: session.userId },
        { memberships: { some: { userId: session.userId } } }
      ]
    }
  });

  if (!hasAccess) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'You do not have access to this project.' } };
  }

  try {
    const issue = await prisma.issue.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        createdBy: session.userId,
      }
    });

    // Notify PM if created by supervisor
    if (session.role === Role.site_supervisor) {
      await prisma.notification.create({
        data: {
          recipientId: hasAccess.assignedProjectManager,
          type: 'issue_created',
          message: `A new ${data.priority} priority issue was reported.`,
          relatedEntityId: issue.id,
          relatedEntityType: 'issue',
        }
      });
    }

    revalidatePath('/issues');
    revalidatePath(`/projects/${data.projectId}`);
    revalidatePath(`/projects/${data.projectId}/issues`);
    revalidatePath('/dashboard');

    return { ok: true, data: issue.id };
  } catch (error) {
    console.error('Create issue error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}

export async function updateIssueStatus(issueId: string, newStatus: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Only project managers can update issue status.' } };
  }

  try {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: {
        projectId: true,
        title: true,
        createdBy: true,
        status: true,
        project: { select: { assignedProjectManager: true } },
      }
    });

    if (!issue || issue.project.assignedProjectManager !== session.userId) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' } };
    }

    await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: newStatus as any,
        resolvedAt: newStatus === 'resolved' ? new Date() : null,
        updatedBy: session.userId,
      }
    });

    // Notify the issue creator when resolved
    if (newStatus === 'resolved' && issue.status !== 'resolved') {
      await prisma.notification.create({
        data: {
          recipientId: issue.createdBy,
          type: 'issue_resolved',
          message: `Your issue '${issue.title}' was resolved.`,
          relatedEntityId: issueId,
          relatedEntityType: 'issue',
        }
      });
    }

    revalidatePath(`/issues/${issueId}`);
    revalidatePath('/issues');
    revalidatePath(`/projects/${issue.projectId}`);
    revalidatePath(`/projects/${issue.projectId}/issues`);
    revalidatePath('/dashboard');

    return { ok: true };
  } catch (error) {
    console.error('Update issue error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}

export async function assignIssue(issueId: string, assigneeId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Only project managers can assign issues.' } };
  }

  try {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: {
        title: true,
        createdBy: true,
        projectId: true,
        project: { select: { assignedProjectManager: true } },
      }
    });

    if (!issue || issue.project.assignedProjectManager !== session.userId) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' } };
    }

    await prisma.issue.update({
      where: { id: issueId },
      data: {
        assignedTo: assigneeId,
        updatedBy: session.userId,
      }
    });

    // Notify the assignee
    await prisma.notification.create({
      data: {
        recipientId: assigneeId,
        type: 'issue_assigned',
        message: `You've been assigned an issue: '${issue.title}'`,
        relatedEntityId: issueId,
        relatedEntityType: 'issue',
      }
    });

    revalidatePath(`/issues/${issueId}`);
    revalidatePath('/issues');
    revalidatePath(`/projects/${issue.projectId}`);

    return { ok: true };
  } catch (error) {
    console.error('Assign issue error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}
