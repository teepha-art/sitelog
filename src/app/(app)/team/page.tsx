import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Role } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { BackButton } from '@/components/ui/BackButton';
import { EmptyState } from '@/components/states/EmptyState';
import { Avatar } from '@/components/ui/Avatar';
import { InviteCodeCard } from '@/components/features/InviteCodeCard';
import { generateInviteCode } from '@/lib/inviteCode';

export default async function TeamPage() {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) notFound();

  // Fetch the PM's own record (to get or backfill invite code)
  const pm = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, inviteCode: true },
  });

  if (!pm) notFound();

  // On-load backfill: generate invite code if missing
  if (!pm.inviteCode) {
    const code = await generateInviteCode();
    await prisma.user.update({
      where: { id: pm.id },
      data: { inviteCode: code },
    });
    pm.inviteCode = code;
  }

  // Find all supervisors who signed up using this PM's invite code
  const teamMembers = await prisma.user.findMany({
    where: {
      role: Role.site_supervisor,
      managerId: session.userId,
    },
    include: {
      memberships: {
        where: {
          project: { assignedProjectManager: session.userId }
        },
        include: { project: { select: { projectName: true } } }
      }
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <BackButton />
        <h2 style={{ 
          fontFamily: 'var(--font-title-large-font-family)', 
          fontSize: 'var(--font-title-large-font-size)',
          fontWeight: '700',
          color: 'var(--color-on-surface)',
          margin: 0
        }}>
          Team Members
        </h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <InviteCodeCard inviteCode={pm.inviteCode} />
      </div>
      
      {teamMembers.length === 0 ? (
        <EmptyState message="You haven't assigned any supervisors to your projects yet." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {teamMembers.map((member) => (
            <Card key={member.id} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <Avatar name={member.fullName} imageUrl={member.profileImageUrl} size={40} />
                <div>
                  <h3 style={{ 
                    fontFamily: 'var(--font-title-medium-font-family)',
                    fontSize: 'var(--font-title-medium-font-size)',
                    fontWeight: '700',
                    margin: '0 0 4px 0' 
                  }}>{member.fullName}</h3>
                  <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-small-font-size)' }}>{member.email}</div>
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-label-small-font-family)',
                  fontWeight: 'var(--font-label-small-font-weight)',
                  fontSize: 'var(--font-label-small-font-size)',
                  lineHeight: 'var(--font-label-small-line-height)',
                  backgroundColor: member.memberships.length > 0 ? 'var(--color-success-container)' : 'var(--color-warning-container)',
                  color: member.memberships.length > 0 ? 'var(--color-on-success-container)' : 'var(--color-on-warning-container)',
                }}>
                  {member.memberships.length > 0 ? 'Assigned' : 'Not assigned'}
                </span>
              </div>


            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
