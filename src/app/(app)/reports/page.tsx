import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/states/EmptyState';
import { FilterBar, FilterDefinition } from '@/components/features/FilterBar';
import styles from './ReportsPage.module.css';

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ date?: string, supervisor?: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const isSupervisor = session.role === Role.site_supervisor;

  const { date, supervisor } = await searchParams;

  const filters: any = {};
  if (date) {
    // Exact date match
    const queryDate = new Date(date);
    filters.reportDate = queryDate;
  }
  if (supervisor && !isSupervisor) {
    filters.submittedBy = supervisor;
  }

  let reports = [];
  let supervisorOptions: { label: string, value: string }[] = [];

  if (isSupervisor) {
    reports = await prisma.dailyReport.findMany({
      where: { 
        submittedBy: session.userId,
        ...filters
      },
      include: { 
        project: { select: { projectName: true } },
        submitter: { select: { fullName: true } }
      },
      orderBy: { reportDate: 'desc' }
    });
  } else {
    reports = await prisma.dailyReport.findMany({
      where: { 
        project: { assignedProjectManager: session.userId },
        ...filters
      },
      include: { 
        project: { select: { projectName: true } },
        submitter: { select: { fullName: true } }
      },
      orderBy: { reportDate: 'desc' }
    });

    const members = await prisma.user.findMany({
      where: {
        role: Role.site_supervisor,
        memberships: {
          some: { project: { assignedProjectManager: session.userId } }
        }
      },
      select: { id: true, fullName: true }
    });
    supervisorOptions = members.map(m => ({ label: m.fullName, value: m.id }));
  }

  const filterDefs: FilterDefinition[] = [
    {
      key: 'date',
      label: 'Report Date',
      type: 'date',
      options: []
    }
  ];

  if (!isSupervisor) {
    filterDefs.push({
      key: 'supervisor',
      label: 'Supervisor',
      type: 'select',
      options: supervisorOptions
    });
  }

  const header = (
    <div className={styles.header}>
      <h1 className={styles.pageTitle}>
        {isSupervisor ? 'My Reports' : 'Reports'}
      </h1>
      {isSupervisor && (
        <Link href="/reports/new">
          <Button>Submit Report</Button>
        </Link>
      )}
    </div>
  );

  if (reports.length === 0) {
    return (
      <div>
        {header}
        <EmptyState 
          message={isSupervisor ? "You haven't submitted any reports yet." : "No reports have been submitted for your projects."}
          action={isSupervisor ? <Link href="/reports/new"><Button>Submit Report</Button></Link> : undefined}
        />
      </div>
    );
  }

  return (
    <div>
      {header}
      <FilterBar filters={filterDefs} />
      
      <div className={styles.grid}>
        {reports.map((report) => (
          <Link key={report.id} href={`/reports/${report.id}`}>
            <Card interactive padding="md" className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  {report.project.projectName}
                </h3>
                <div className={styles.cardDate}>
                  {report.reportDate.toLocaleDateString()}
                </div>
              </div>
              
              <div className={styles.cardMeta}>
                {!isSupervisor && (
                  <div className={styles.metaRow}>
                    <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"></circle><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"></path></svg>
                    <span>{report.submitter?.fullName}</span>
                  </div>
                )}
                <div className={styles.metaRow}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span className={styles.truncateText}>
                    {report.completedWork}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
