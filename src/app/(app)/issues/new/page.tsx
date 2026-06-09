import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { IssueForm } from './IssueForm';
import { Role } from '@prisma/client';
import styles from './NewIssuePage.module.css';

export default async function NewIssuePage() {
  const session = await getSession();
  if (!session) return null;

  // Fetch projects user has access to
  let projects = [];
  if (session.role === Role.project_manager) {
    projects = await prisma.project.findMany({
      where: { assignedProjectManager: session.userId, status: 'active' },
      select: { id: true, projectName: true },
      orderBy: { projectName: 'asc' }
    });
  } else {
    projects = await prisma.project.findMany({
      where: { memberships: { some: { userId: session.userId } }, status: 'active' },
      select: { id: true, projectName: true },
      orderBy: { projectName: 'asc' }
    });
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>
        Report New Issue
      </h1>
      
      {projects.length === 0 ? (
        <div className={styles.emptyMessage}>
          You must have access to an active project to report an issue.
        </div>
      ) : (
        <IssueForm projects={projects.map(p => ({ id: p.id, name: p.projectName }))} />
      )}
    </div>
  );
}
