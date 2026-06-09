'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { reportSchema } from '@/lib/validation';
import { ActionResult } from '@/types';
import { Role } from '@prisma/client';

export async function submitReport(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session || session.role !== Role.site_supervisor) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Only site supervisors can submit daily reports.' } };
  }

  const rawData = {
    projectId: formData.get('projectId') as string,
    reportDate: formData.get('reportDate') as string,
    weatherCondition: formData.get('weatherCondition') as string,
    completedWork: formData.get('completedWork') as string,
    delays: formData.get('delays') as string || null,
    notes: formData.get('notes') as string || null,
    progressPercentage: Number(formData.get('progressPercentage')),
  };

  const validationResult = reportSchema.safeParse(rawData);
  if (!validationResult.success) {
    const fieldErrors = validationResult.error.issues.map(i => i.message).join(', ');
    return { ok: false, error: { code: 'BAD_REQUEST', message: fieldErrors || 'Please complete all required fields correctly.' } };
  }

  const data = validationResult.data;

  // Check access to project
  const membership = await prisma.projectMembership.findUnique({
    where: { projectId_userId: { projectId: data.projectId, userId: session.userId } },
    include: { project: { select: { assignedProjectManager: true } } }
  });

  if (!membership) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'You are not assigned to this project.' } };
  }

  try {
    // Submit report
    const report = await prisma.dailyReport.create({
      data: {
        projectId: data.projectId,
        submittedBy: session.userId,
        reportDate: new Date(data.reportDate),
        weatherCondition: data.weatherCondition,
        completedWork: data.completedWork,
        delays: data.delays,
        notes: data.notes,
        progressPercentage: data.progressPercentage,
      }
    });

    // Create Notification for PM
    await prisma.notification.create({
      data: {
        recipientId: membership.project.assignedProjectManager,
        type: 'report_submitted',
        message: `A new report has been submitted by a supervisor.`,
        relatedEntityId: report.id,
        relatedEntityType: 'report',
      }
    });

    revalidatePath('/reports');
    revalidatePath(`/projects/${data.projectId}`);
    revalidatePath(`/projects/${data.projectId}/reports`);
    revalidatePath('/dashboard');

    return { ok: true, data: report.id };
  } catch (error: any) {
    console.error('Submit report error:', error);
    if (error.code === 'P2002') {
      return { ok: false, error: { code: 'CONFLICT', message: 'A report for this project and date has already been submitted.' } };
    }
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}
