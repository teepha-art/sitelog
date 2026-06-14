import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/states/EmptyState';
import { Avatar } from '@/components/ui/Avatar';

export default async function ProjectReportsTab({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;

  // We are already authorized via the layout

  const reports = await prisma.dailyReport.findMany({
    where: { projectId: id },
    include: { submitter: { select: { fullName: true, profileImageUrl: true } } },
    orderBy: { reportDate: 'desc' }
  });

  if (reports.length === 0) {
    return (
      <EmptyState message="No reports have been submitted for this project yet." />
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
      {reports.map((report) => (
        <Link key={report.id} href={`/reports/${report.id}`}>
          <Card interactive padding="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ 
                fontFamily: 'var(--font-title-large-font-family)',
                fontSize: 'var(--font-title-large-font-size)',
                marginBottom: '4px'
              }}>
                {report.reportDate.toLocaleDateString()}
              </h3>
              <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-small-font-size)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar name={report.submitter.fullName} imageUrl={report.submitter.profileImageUrl} size={20} />
                <span>By {report.submitter.fullName}</span>
              </div>
            </div>
            
            <div style={{ color: 'var(--color-on-surface-variant)', flex: 1 }}>
              <div style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {report.completedWork}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
