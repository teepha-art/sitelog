import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Role } from '@prisma/client';
import { Avatar } from '@/components/ui/Avatar';
import styles from './ReportDetail.module.css';

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;

  const report = await prisma.dailyReport.findUnique({
    where: { id },
    include: {
      project: true,
      submitter: { select: { fullName: true, profileImageUrl: true } },
      attachments: { where: { isDeleted: false } }
    }
  });

  if (!report) notFound();

  // Authorize: PM must manage the project, Supervisor must own the report
  const isPM = session.role === Role.project_manager;
  if (isPM && report.project.assignedProjectManager !== session.userId) {
    notFound();
  }
  if (!isPM && report.submittedBy !== session.userId) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>
          Daily Report: {report.project.projectName}
        </h1>
        <div className={styles.subtitle}>
          <Avatar name={report.submitter.fullName} imageUrl={report.submitter.profileImageUrl} size={24} />
          <span>Submitted by {report.submitter.fullName} on {report.reportDate.toLocaleDateString()}</span>
        </div>
      </div>

      <Card padding="lg" className={styles.card}>
        <div className={styles.infoGrid}>
          <div>
            <div className={styles.infoLabel}>Weather</div>
            <div>{report.weatherCondition}</div>
          </div>
          <div>
            <div className={styles.infoLabel}>Progress</div>
            <div>{report.progressPercentage}%</div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Completed Work</h3>
          <div className={styles.preWrap}>{report.completedWork}</div>
        </div>

        {report.delays && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Delays</h3>
            <div className={styles.delaysBox}>
              {report.delays}
            </div>
          </div>
        )}

        {report.attachments && report.attachments.length > 0 && (
          <div>
            <h3 className={styles.sectionTitle}>Attachments</h3>
            <div className={styles.attachmentsRow}>
              {report.attachments.map((att) => (
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
      </Card>
    </div>
  );
}
