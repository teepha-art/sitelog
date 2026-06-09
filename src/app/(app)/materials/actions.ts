'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { materialRequestSchema } from '@/lib/validation';
import { ActionResult } from '@/types';
import { Role } from '@prisma/client';

export async function createMaterialRequest(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session || session.role !== Role.site_supervisor) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Only site supervisors can request materials.' } };
  }

  const rawData = {
    projectId: formData.get('projectId') as string,
    materialName: formData.get('materialName') as string,
    quantity: formData.get('quantity') as string,
    urgencyLevel: formData.get('urgencyLevel') as string,
    notes: formData.get('notes') as string || null,
  };

  const validationResult = materialRequestSchema.safeParse(rawData);
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
    const request = await prisma.materialRequest.create({
      data: {
        projectId: data.projectId,
        materialName: data.materialName,
        quantity: data.quantity,
        urgencyLevel: data.urgencyLevel,
        notes: data.notes,
        requestedBy: session.userId,
      }
    });

    // Notify PM
    await prisma.notification.create({
      data: {
        recipientId: membership.project.assignedProjectManager,
        type: 'material_request_submitted',
        message: `A new material request was submitted for ${data.materialName}.`,
        relatedEntityId: request.id,
        relatedEntityType: 'material_request',
      }
    });

    revalidatePath('/materials');
    revalidatePath(`/projects/${data.projectId}`);
    revalidatePath(`/projects/${data.projectId}/materials`);
    revalidatePath('/dashboard');

    return { ok: true, data: request.id };
  } catch (error) {
    console.error('Create material request error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}

export async function updateRequestStatus(requestId: string, newStatus: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) {
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Only project managers can update request status.' } };
  }

  try {
    const request = await prisma.materialRequest.findUnique({
      where: { id: requestId },
      select: {
        requestedBy: true,
        materialName: true,
        projectId: true,
        project: { select: { assignedProjectManager: true } },
      }
    });

    if (!request || request.project.assignedProjectManager !== session.userId) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' } };
    }

    const updateData: Record<string, unknown> = { status: newStatus as any };
    if (newStatus === 'approved') {
      updateData.approvedBy = session.userId;
      updateData.approvedAt = new Date();
    } else if (newStatus === 'rejected') {
      updateData.rejectedBy = session.userId;
      updateData.rejectedAt = new Date();
    } else if (newStatus === 'fulfilled') {
      updateData.fulfilledAt = new Date();
    }

    await prisma.materialRequest.update({
      where: { id: requestId },
      data: updateData
    });

    // Notify the supervisor who submitted the request
    if (['approved', 'rejected', 'fulfilled'].includes(newStatus)) {
      const typeMap: Record<string, 'material_request_approved' | 'material_request_rejected' | 'material_request_fulfilled'> = {
        approved: 'material_request_approved',
        rejected: 'material_request_rejected',
        fulfilled: 'material_request_fulfilled',
      };
      await prisma.notification.create({
        data: {
          recipientId: request.requestedBy,
          type: typeMap[newStatus],
          message: `Your request for ${request.materialName} was ${newStatus}.`,
          relatedEntityId: requestId,
          relatedEntityType: 'material_request',
        }
      });
    }

    revalidatePath(`/materials/${requestId}`);
    revalidatePath('/materials');
    revalidatePath(`/projects/${request.projectId}`);
    revalidatePath(`/projects/${request.projectId}/materials`);
    revalidatePath('/dashboard');

    return { ok: true };
  } catch (error) {
    console.error('Update request status error:', error);
    return { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' } };
  }
}
