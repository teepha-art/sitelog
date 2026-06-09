import { Role } from '@prisma/client';
import { prisma } from './prisma';

export function isProjectManager(role: Role) {
  return role === Role.project_manager;
}

export function isSiteSupervisor(role: Role) {
  return role === Role.site_supervisor;
}

export function canCreateProject(role: Role) {
  return isProjectManager(role);
}

export function canSubmitReport(role: Role) {
  return isSiteSupervisor(role);
}

export function canApproveRequest(role: Role) {
  return isProjectManager(role);
}

export async function isAssignedToProject(userId: string, projectId: string) {
  const membership = await prisma.projectMembership.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });
  return !!membership;
}

export async function isProjectManagerOf(userId: string, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { assignedProjectManager: true },
  });
  return project?.assignedProjectManager === userId;
}

export async function canAccessProject(userId: string, role: Role, projectId: string) {
  // Both roles need explicit assignment via membership to see the project 
  // (In PRD PM is assigned to projects they manage via membership or assignedPM field)
  const isAssigned = await isAssignedToProject(userId, projectId);
  if (isAssigned) return true;
  
  if (role === Role.project_manager) {
    return await isProjectManagerOf(userId, projectId);
  }
  return false;
}
