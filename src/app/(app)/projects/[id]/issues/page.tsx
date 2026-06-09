import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/states/EmptyState';
import { Button } from '@/components/ui/Button';

export default async function ProjectIssuesTab({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;

  // We are already authorized via the layout

  const issues = await prisma.issue.findMany({
    where: { projectId: id },
    include: { 
      creator: { select: { fullName: true } },
      assignee: { select: { fullName: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (issues.length === 0) {
    return (
      <EmptyState 
        message="No issues have been reported for this project." 
        action={<Link href={`/issues/new`}><Button>Report Issue</Button></Link>}
      />
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
      {issues.map((issue) => (
        <Link key={issue.id} href={`/issues/${issue.id}`}>
          <Card interactive padding="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ 
                  fontFamily: 'var(--font-title-large-font-family)',
                  fontSize: 'var(--font-title-large-font-size)',
                  marginBottom: '4px'
                }}>
                  {issue.title}
                </h3>
              </div>
              <StatusChip status={issue.status} />
            </div>
            
            <div style={{ color: 'var(--color-on-surface-variant)', flex: 1, marginBottom: '16px' }}>
              <div style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {issue.description}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-small-font-size)' }}>
              <span>{issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}</span>
              <span>{issue.createdAt.toLocaleDateString()}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
