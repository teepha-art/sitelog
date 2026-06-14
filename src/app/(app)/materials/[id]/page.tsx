import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { Role } from '@prisma/client';
import { Avatar } from '@/components/ui/Avatar';
import StatusUpdateForm from './StatusUpdateForm';
import styles from './MaterialDetail.module.css';

export default async function MaterialRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;

  const request = await prisma.materialRequest.findUnique({
    where: { id },
    include: {
      project: true,
      requester: { select: { fullName: true, profileImageUrl: true } }
    }
  });

  if (!request) notFound();

  // Authorize
  const isPM = session.role === Role.project_manager;
  if (isPM) {
    if (request.project.assignedProjectManager !== session.userId) notFound();
  } else {
    if (request.requestedBy !== session.userId) notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>
          {request.materialName} ({request.quantity})
        </h1>
        <div className={styles.subtitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{request.project.projectName} • Requested by</span>
          <Avatar name={request.requester.fullName} imageUrl={request.requester.profileImageUrl} size={24} />
          <span>{request.requester.fullName} on {request.createdAt.toLocaleDateString()}</span>
        </div>
      </div>

      <Card padding="lg" className={styles.card}>
        <div className={styles.infoGrid}>
          <div>
            <div className={styles.infoLabel}>Status</div>
            <StatusChip status={request.status} />
          </div>
          <div>
            <div className={styles.infoLabel}>Urgency</div>
            <div>{request.urgencyLevel.charAt(0).toUpperCase() + request.urgencyLevel.slice(1)}</div>
          </div>
        </div>

        {request.notes && (
          <div className={styles.notesSection}>
            <h3 className={styles.sectionTitle}>Notes</h3>
            <div className={styles.notesText}>{request.notes}</div>
          </div>
        )}

        {isPM && (
          <div className={styles.statusUpdateSection}>
            <h3 className={styles.statusUpdateTitle}>Update Status</h3>
            <StatusUpdateForm requestId={request.id} currentStatus={request.status} />
          </div>
        )}
      </Card>
    </div>
  );
}
