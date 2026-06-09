import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { ReportForm } from './ReportForm';
import styles from './NewReportPage.module.css';

export default async function NewReportPage() {
  const session = await getSession();
  if (!session || session.role !== Role.site_supervisor) {
    redirect('/reports');
  }

  // Fetch projects supervisor is assigned to
  const projects = await prisma.project.findMany({
    where: {
      memberships: { some: { userId: session.userId } },
      status: 'active' // Only allow reports on active projects
    },
    select: { id: true, projectName: true },
    orderBy: { projectName: 'asc' }
  });

  return (
    <div>
      <h1 className={styles.pageTitle}>
        Submit Daily Report
      </h1>
      
      {projects.length === 0 ? (
        <div className={styles.emptyMessage}>
          You must be assigned to an active project to submit a report.
        </div>
      ) : (
        <ReportForm projects={projects.map(p => ({ id: p.id, name: p.projectName }))} />
      )}
    </div>
  );
}
