import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { Role } from '@prisma/client';

// We need a tiny client component for the status update form
import StatusUpdateForm from './StatusUpdateForm';
import styles from './IssueDetail.module.css';

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;

  const issue = await prisma.issue.findUnique({
    where: { id },
    include: {
      project: true,
      creator: { select: { fullName: true } },
      assignee: { select: { fullName: true, id: true } },
      attachments: { where: { isDeleted: false } }
    }
  });

  if (!issue) notFound();

  // Authorize
  const isPM = session.role === Role.project_manager;
  if (isPM) {
    if (issue.project.assignedProjectManager !== session.userId) notFound();
  } else {
    // Supervisor must be assigned to the project
    const membership = await prisma.projectMembership.findUnique({
      where: { projectId_userId: { projectId: issue.projectId, userId: session.userId } }
    });
    if (!membership) notFound();
  }

  // Fetch supervisors for the assign dropdown (PM only)
  let supervisors: { id: string; fullName: string }[] = [];
  if (isPM) {
    supervisors = await prisma.user.findMany({
      where: {
        role: Role.site_supervisor,
        memberships: { some: { projectId: issue.projectId } },
      },
      select: { id: true, fullName: true },
      orderBy: { fullName: 'asc' },
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>
          {issue.title}
        </h1>
        <p className={styles.subtitle}>
          {issue.project.projectName} • Reported by {issue.creator.fullName} on {issue.createdAt.toLocaleDateString()}
        </p>
      </div>

      <Card padding="lg" className={styles.card}>
        <div className={styles.infoGrid}>
          <div>
            <div className={styles.infoLabel}>Status</div>
            <StatusChip status={issue.status} />
          </div>
          <div>
            <div className={styles.infoLabel}>Priority</div>
            <div>{issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}</div>
          </div>
          <div>
            <div className={styles.infoLabel}>Assigned To</div>
            <div>{issue.assignee ? issue.assignee.fullName : 'Unassigned'}</div>
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <h3 className={styles.sectionTitle}>Description</h3>
          <div className={styles.descriptionText}>{issue.description}</div>
        </div>

        {issue.attachments.length > 0 && (
          <div className={styles.attachmentsSection}>
            <h3 className={styles.sectionTitle}>Attachments</h3>
            <div className={styles.attachmentsRow}>
              {issue.attachments.map((att) => (
                <a key={att.id} href={att.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.attachmentLink}>
                  {att.mimeType.startsWith('image/') ? (
                    <img src={att.fileUrl} alt={att.fileName} className={styles.attachmentImage} />
                  ) : (
                    <div className={styles.attachmentPlaceholder}>
                      <span className={styles.attachmentFileName}>PDF</span>
                      <span className={styles.attachmentFileSubtext}>{att.fileName}</span>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {isPM && (
          <div className={styles.statusUpdateSection}>
            <h3 className={styles.statusUpdateTitle}>Update Status</h3>
            <StatusUpdateForm
              issueId={issue.id}
              currentStatus={issue.status}
              currentAssigneeId={issue.assignee?.id ?? null}
              supervisors={supervisors}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
