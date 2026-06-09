import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/states/EmptyState';
import { PROJECT_STATUSES } from '@/lib/constants';
import styles from './ProjectsPage.module.css';

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { status } = await searchParams;
  const isPM = session.role === Role.project_manager;

  const statusFilter = status && PROJECT_STATUSES.includes(status as any) ? { status: status as any } : {};

  let projects = [];
  if (isPM) {
    projects = await prisma.project.findMany({
      where: {
        ...statusFilter,
        OR: [
          { assignedProjectManager: session.userId },
          { memberships: { some: { userId: session.userId } } }
        ]
      },
      include: {
        manager: { select: { fullName: true } },
        _count: { select: { memberships: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  } else {
    projects = await prisma.project.findMany({
      where: {
        ...statusFilter,
        memberships: { some: { userId: session.userId } }
      },
      include: {
        manager: { select: { fullName: true } },
        _count: { select: { memberships: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  const header = (
    <div className={styles.header}>
      <h1 className={styles.pageTitle}>
        {isPM ? 'Projects' : 'My Projects'}
      </h1>
      {isPM && (
        <Link href="/projects/new">
          <Button>Create Project</Button>
        </Link>
      )}
    </div>
  );

  if (projects.length === 0) {
    const emptyMessage = isPM 
      ? "No active projects yet. Create your first project to get started." 
      : "You have not been assigned to any projects yet. Your project manager will add you to a project.";

    const action = isPM ? (
      <Link href="/projects/new">
        <Button>Create Project</Button>
      </Link>
    ) : undefined;

    return (
      <div>
        {header}
        <div className={styles.emptyContainer}><EmptyState message={emptyMessage} action={action} /></div>
      </div>
    );
  }

  return (
    <div>
      {header}
      
      <div className={styles.grid}>
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card interactive padding="md" className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>
                    {project.projectName}
                  </h3>
                  <div className={styles.cardCode}>
                    {project.projectCode}
                  </div>
                </div>
                <StatusChip status={project.status} />
              </div>
              
              <div className={styles.cardMeta}>
                <div className={styles.metaRow}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>{project.location}</span>
                </div>
                <div className={styles.metaRow}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span>{project.manager.fullName} (PM)</span>
                </div>
                <div className={styles.metaRow}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  <span>{project._count.memberships} team members</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
