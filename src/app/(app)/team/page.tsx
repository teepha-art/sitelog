import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Role } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/states/EmptyState';
import { Avatar } from '@/components/ui/Avatar';

export default async function TeamPage() {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) notFound();

  // Find all supervisors assigned to this PM's projects
  const teamMembers = await prisma.user.findMany({
    where: {
      role: Role.site_supervisor,
      memberships: {
        some: {
          project: { assignedProjectManager: session.userId }
        }
      }
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
      <h1 style={{ 
        fontFamily: 'var(--font-headline-medium-font-family)', 
        fontSize: 'var(--font-headline-medium-font-size)',
        fontWeight: '700',
        marginBottom: '24px'
      }}>
        Team Overview
      </h1>
      
      {teamMembers.length === 0 ? (
        <EmptyState message="You haven't assigned any supervisors to your projects yet." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {teamMembers.map((member) => (
            <Card key={member.id} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <Avatar name={member.fullName} imageUrl={member.profileImageUrl} size={40} />
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{member.fullName}</h3>
                  <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-small-font-size)' }}>{member.email}</div>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: 'var(--font-label-small-font-size)', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', marginBottom: '8px' }}>
                  Assigned Projects
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {member.memberships.map(pm => (
                    <span key={pm.projectId} style={{ 
                      padding: '4px 8px', backgroundColor: 'var(--color-surface-variant)', 
                      borderRadius: '4px', fontSize: 'var(--font-body-small-font-size)' 
                    }}>
                      {pm.project.projectName}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
