import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/states/EmptyState';
import { FilterBar, FilterDefinition } from '@/components/features/FilterBar';
import { Avatar } from '@/components/ui/Avatar';
import { ISSUE_STATUSES, PRIORITIES } from '@/lib/constants';
import styles from './IssuesPage.module.css';

export default async function IssuesPage({ searchParams }: { searchParams: Promise<{ status?: string, priority?: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const isSupervisor = session.role === Role.site_supervisor;

  const { status, priority } = await searchParams;

  const filters: any = {};
  if (status && ISSUE_STATUSES.includes(status as any)) {
    filters.status = status;
  }
  if (priority && PRIORITIES.includes(priority as any)) {
    filters.priority = priority;
  }

  let issues = [];
  if (isSupervisor) {
    issues = await prisma.issue.findMany({
      where: { 
        project: { memberships: { some: { userId: session.userId } } },
        ...filters
      },
      include: { 
        project: { select: { projectName: true } },
        creator: { select: { fullName: true, profileImageUrl: true } },
        assignee: { select: { fullName: true, profileImageUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  } else {
    issues = await prisma.issue.findMany({
      where: { 
        project: { assignedProjectManager: session.userId },
        ...filters
      },
      include: { 
        project: { select: { projectName: true } },
        creator: { select: { fullName: true, profileImageUrl: true } },
        assignee: { select: { fullName: true, profileImageUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  const filterDefs: FilterDefinition[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ISSUE_STATUSES.map(s => ({ value: s, label: s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }))
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: PRIORITIES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))
    }
  ];

  const header = (
    <div className={styles.header}>
      <h1 className={styles.pageTitle}>
        {isSupervisor ? 'My Issues' : 'Issues'}
      </h1>
      <Link href="/issues/new">
        <Button>Report Issue</Button>
      </Link>
    </div>
  );

  if (issues.length === 0) {
    return (
      <div>
        {header}
        <EmptyState 
          message={isSupervisor ? "No issues have been reported on your projects." : "No issues have been reported across your projects."}
          action={<Link href="/issues/new"><Button>Report Issue</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div>
      {header}
      <FilterBar filters={filterDefs} />
      
      <div className={styles.grid}>
        {issues.map((issue) => (
          <Link key={issue.id} href={`/issues/${issue.id}`}>
            <Card interactive padding="md" className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>
                    {issue.title}
                  </h3>
                  <div className={styles.cardProjectName}>
                    {issue.project.projectName}
                  </div>
                </div>
                <StatusChip status={issue.status} />
              </div>
              
              <div className={styles.cardMeta}>
                <div className={styles.metaRow}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <span>Priority: {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}</span>
                </div>
                <div className={styles.metaRow}>
                  <Avatar name={issue.creator.fullName} imageUrl={issue.creator.profileImageUrl} size={20} className={styles.metaIconOverride} />
                  <span>Reported by: {issue.creator.fullName}</span>
                </div>
                {!isSupervisor && issue.assignee && (
                  <div className={styles.metaRow}>
                    <Avatar name={issue.assignee.fullName} imageUrl={issue.assignee.profileImageUrl} size={20} className={styles.metaIconOverride} />
                    <span>Assigned to: {issue.assignee.fullName}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.cardDate}>
                {issue.createdAt.toLocaleDateString()}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
