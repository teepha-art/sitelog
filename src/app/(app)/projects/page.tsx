import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/states/EmptyState';
import { Avatar, AvatarStack } from '@/components/ui/Avatar';
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
        manager: { select: { fullName: true, profileImageUrl: true } },
        memberships: {
          select: { user: { select: { fullName: true, profileImageUrl: true } } },
          take: 3
        },
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
        manager: { select: { fullName: true, profileImageUrl: true } },
        memberships: {
          select: { user: { select: { fullName: true, profileImageUrl: true } } },
          take: 3
        },
        _count: { select: { memberships: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  const header = (
    <div className={styles.header}>
      {isPM ? (
        <Link href="/projects/new" style={{ marginLeft: 'auto' }}>
          <Button>Create Project</Button>
        </Link>
      ) : null}
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
                  <Avatar name={project.manager.fullName} imageUrl={project.manager.profileImageUrl} size={20} className={styles.metaIconOverride} />
                  <span>{project.manager.fullName} (PM)</span>
                </div>
                <div className={styles.metaRow}>
                  <AvatarStack 
                    users={project.memberships.map(m => m.user)} 
                    totalCount={project._count.memberships} 
                    size={20} 
                  />
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
