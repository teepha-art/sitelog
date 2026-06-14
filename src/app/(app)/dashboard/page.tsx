import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getRecentActivity } from '@/lib/activity';
import { Role } from '@prisma/client';
import { KpiCard } from '@/components/features/KpiCard';
import { ActivityTable } from '@/components/features/ActivityTable';
import { EmptyState } from '@/components/states/EmptyState';
import { Button } from '@/components/ui/Button';
import { notFound } from 'next/navigation';
import {
  Briefcase,
  Clock,
  AlertCircle,
  ClipboardList,
  FileText,
} from 'lucide-react';
import styles from './DashboardPage.module.css';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) {
    notFound();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    activeProjects,
    delayedProjects,
    openIssues,
    pendingRequests,
    reportsToday,
    totalProjects,
    recentActivity
  ] = await Promise.all([
    prisma.project.count({
      where: { assignedProjectManager: session.userId, status: 'active' }
    }),
    prisma.project.count({
      where: { assignedProjectManager: session.userId, status: 'delayed' }
    }),
    prisma.issue.count({
      where: { project: { assignedProjectManager: session.userId }, status: 'open' }
    }),
    prisma.materialRequest.count({
      where: { project: { assignedProjectManager: session.userId }, status: 'pending' }
    }),
    prisma.dailyReport.count({
      where: {
        project: { assignedProjectManager: session.userId },
        reportDate: { gte: today }
      }
    }),
    prisma.project.count({
      where: { assignedProjectManager: session.userId }
    }),
    getRecentActivity(session.userId)
  ]);

  return (
    <div className={styles.page}>

      {totalProjects === 0 ? (
        <EmptyState
          message="Welcome to SiteLog! You don't have any projects yet."
          action={
            <Link href="/projects/new">
              <Button>Create Your First Project</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className={styles.kpiRow}>
            <KpiCard
              label="Active Projects"
              value={activeProjects}
              href="/projects?status=active"
              icon={<Briefcase size={16} />}
              accent
            />
            <KpiCard
              label="Delayed Projects"
              value={delayedProjects}
              href="/projects?status=delayed"
              icon={<Clock size={16} />}
            />
            <KpiCard
              label="Open Issues"
              value={openIssues}
              href="/issues?status=open"
              icon={<AlertCircle size={16} />}
            />
            <KpiCard
              label="Pending Requests"
              value={pendingRequests}
              href="/materials?status=pending"
              icon={<ClipboardList size={16} />}
            />
            <KpiCard
              label="Reports Today"
              value={reportsToday}
              href={`/reports?date=${today.toISOString().split('T')[0]}`}
              icon={<FileText size={16} />}
            />
          </div>

          <section className={styles.activitySection}>
            <ActivityTable items={recentActivity} />
          </section>
        </>
      )}
    </div>
  );
}
