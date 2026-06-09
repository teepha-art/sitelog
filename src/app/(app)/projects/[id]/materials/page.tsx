import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/states/EmptyState';

export default async function ProjectMaterialsTab({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;

  // We are already authorized via the layout

  const requests = await prisma.materialRequest.findMany({
    where: { projectId: id },
    include: { requester: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' }
  });

  if (requests.length === 0) {
    return (
      <EmptyState message="No material requests have been submitted for this project." />
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
      {requests.map((req) => (
        <Link key={req.id} href={`/materials/${req.id}`}>
          <Card interactive padding="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ 
                  fontFamily: 'var(--font-title-large-font-family)',
                  fontSize: 'var(--font-title-large-font-size)',
                  marginBottom: '4px'
                }}>
                  {req.materialName}
                </h3>
                <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-small-font-size)' }}>
                  Qty: {req.quantity} • Req by: {req.requester.fullName}
                </div>
              </div>
              <StatusChip status={req.status} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-small-font-size)', marginTop: 'auto' }}>
              <span>{req.urgencyLevel.charAt(0).toUpperCase() + req.urgencyLevel.slice(1)} Urgency</span>
              <span>{req.createdAt.toLocaleDateString()}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
