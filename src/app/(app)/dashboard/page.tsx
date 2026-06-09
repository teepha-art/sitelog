import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getRecentActivity } from '@/lib/activity';
import { Role } from '@prisma/client';
import { KpiCard } from '@/components/features/KpiCard';
import { EmptyState } from '@/components/states/EmptyState';
import { Button } from '@/components/ui/Button';
import { notFound } from 'next/navigation';
import styles from './DashboardPage.module.css';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) {
    notFound();
  }

  // Fetch KPI data
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
          {/* KPI Cards Row */}
          <div className={styles.kpiRow}>
            <KpiCard label="Active Projects" value={activeProjects} href="/projects?status=active" />
            <KpiCard label="Delayed Projects" value={delayedProjects} href="/projects?status=delayed" variant={delayedProjects > 0 ? 'warning' : 'default'} />
            <KpiCard label="Open Issues" value={openIssues} href="/issues?status=open" variant={openIssues > 0 ? 'error' : 'default'} />
            <KpiCard label="Pending Requests" value={pendingRequests} href="/materials?status=pending" variant={pendingRequests > 0 ? 'warning' : 'default'} />
            <KpiCard label="Reports Today" value={reportsToday} href={`/reports?date=${today.toISOString().split('T')[0]}`} />
          </div>

          {/* Recent Activity Section */}
          <section className={styles.activitySection}>
            <h2 className={styles.activityTitle}>
              Recent Activity
            </h2>
            <div className={styles.activityCard}>
              {recentActivity.length === 0 ? (
                <EmptyState message="No recent activity to display." />
              ) : (
                <div className={styles.activityList}>
                  {recentActivity.map((item, i) => (
                    <Link key={`${item.id}-${i}`} href={item.href} className={styles.activityItem}>
                      <div className={styles.activityItemHeader}>
                        <span className={styles.activityItemTitle}>
                          {item.title}
                        </span>
                        <span className={styles.activityItemDate}>
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.activityItemDesc}>
                        <span className={styles.activityProjectName}>{item.projectName}</span> • {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
