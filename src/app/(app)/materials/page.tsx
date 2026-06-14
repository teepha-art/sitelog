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
import { REQUEST_STATUSES, PRIORITIES } from '@/lib/constants';
import styles from './MaterialsPage.module.css';

export default async function MaterialsPage({ searchParams }: { searchParams: Promise<{ status?: string, urgency?: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const isSupervisor = session.role === Role.site_supervisor;

  const { status, urgency } = await searchParams;

  const filters: any = {};
  if (status && REQUEST_STATUSES.includes(status as any)) {
    filters.status = status;
  }
  if (urgency && PRIORITIES.includes(urgency as any)) {
    filters.urgencyLevel = urgency;
  }

  let requests = [];
  if (isSupervisor) {
    requests = await prisma.materialRequest.findMany({
      where: { 
        requestedBy: session.userId,
        ...filters 
      },
      include: { 
        project: { select: { projectName: true } },
        requester: { select: { fullName: true, profileImageUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  } else {
    requests = await prisma.materialRequest.findMany({
      where: { 
        project: { assignedProjectManager: session.userId },
        ...filters 
      },
      include: { 
        project: { select: { projectName: true } },
        requester: { select: { fullName: true, profileImageUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  const filterDefs: FilterDefinition[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: REQUEST_STATUSES.map(s => ({ value: s, label: s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }))
    },
    {
      key: 'urgency',
      label: 'Urgency',
      type: 'select',
      options: PRIORITIES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))
    }
  ];

  const header = (
    <div className={styles.header}>
      <h1 className={styles.pageTitle}>
        {isSupervisor ? 'My Requests' : 'Material Requests'}
      </h1>
      {isSupervisor && (
        <Link href="/materials/new">
          <Button>Request Materials</Button>
        </Link>
      )}
    </div>
  );

  if (requests.length === 0) {
    return (
      <div>
        {header}
        <EmptyState 
          message={isSupervisor ? "You haven't requested any materials yet." : "No material requests have been submitted across your projects."}
          action={isSupervisor ? <Link href="/materials/new"><Button>Request Materials</Button></Link> : undefined}
        />
      </div>
    );
  }

  return (
    <div>
      {header}
      <FilterBar filters={filterDefs} />
      
      <div className={styles.grid}>
        {requests.map((req) => (
          <Link key={req.id} href={`/materials/${req.id}`}>
            <Card interactive padding="md" className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>
                    {req.materialName}
                  </h3>
                  <div className={styles.cardSubtitle}>
                    Qty: {req.quantity} • {req.project.projectName}
                  </div>
                </div>
                <StatusChip status={req.status} />
              </div>
              
              <div className={styles.cardMeta}>
                <div className={styles.metaRow}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <span>Urgency: {req.urgencyLevel.charAt(0).toUpperCase() + req.urgencyLevel.slice(1)}</span>
                </div>
                {!isSupervisor && (
                  <div className={styles.metaRow}>
                    <Avatar name={req.requester.fullName} imageUrl={req.requester.profileImageUrl} size={20} className={styles.metaIconOverride} />
                    <span>Requested by: {req.requester.fullName}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.cardDate}>
                {req.createdAt.toLocaleDateString()}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
