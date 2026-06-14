import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { canAccessProject } from '@/lib/permissions';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { Role } from '@prisma/client';
import { SupervisorList } from './SupervisorList';
import { ProjectActions } from './ProjectActions';
import { ProjectTabs } from './ProjectTabs';
import styles from './ProjectLayout.module.css';

export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/auth');

  const { id } = await params;

  const hasAccess = await canAccessProject(session.userId, session.role, id);
  if (!hasAccess) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      manager: { select: { fullName: true } },
      _count: { select: { memberships: true } },
      memberships: {
        include: { user: { select: { id: true, fullName: true, email: true } } },
      },
    }
  });

  if (!project) notFound();

  const isPM = session.role === Role.project_manager;

  return (
    <div className={styles.page}>
      {/* Project Header */}
      <Card padding="lg">
        <div className={styles.headerRow}>
          <div>
            <div className={styles.titleRow}>
              <h1 className={styles.projectTitle}>
                {project.projectName}
              </h1>
              <StatusChip status={project.status} />
            </div>
            
            <p className={styles.metaLine}>
              {project.projectCode} • {project.location}
            </p>

            {project.description && (
              <p className={styles.description}>
                {project.description}
              </p>
            )}

            <div className={styles.metaRow}>
              <div><strong>PM:</strong> {project.manager.fullName}</div>
              <div><strong>Team:</strong> {project._count.memberships} members</div>
              <div><strong>Start:</strong> {project.startDate.toLocaleDateString()}</div>
              <div><strong>End:</strong> {project.expectedEndDate.toLocaleDateString()}</div>
            </div>
          </div>
          
          {isPM && (
            <ProjectActions
              projectId={id}
              initialData={{
                projectName: project.projectName,
                description: project.description,
                location: project.location,
                status: project.status,
                startDate: project.startDate.toISOString().split('T')[0],
                expectedEndDate: project.expectedEndDate.toISOString().split('T')[0],
              }}
            />
          )}
        </div>
        
        {isPM && project.memberships.length > 0 && (
          <SupervisorList projectId={id} memberships={project.memberships.map(m => ({ userId: m.user.id, fullName: m.user.fullName, email: m.user.email }))} />
        )}
      </Card>

      {/* Tabs */}
      <ProjectTabs projectId={id} />

      {/* Content Area */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
