import React from 'react';
import Link from 'next/link';
import { getRecentActivity } from '@/lib/activity';
import { getSession } from '@/lib/auth';
import { EmptyState } from '@/components/states/EmptyState';
import styles from './ProjectActivity.module.css';

export default async function ProjectActivityTab({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  const recentActivity = await getRecentActivity(session.userId, id);

  return (
    <div>
      {recentActivity.length === 0 ? (
        <EmptyState message="No recent activity for this project." />
      ) : (
        <div className={styles.activityCard}>
          {recentActivity.map((item, i) => (
            <Link key={`${item.id}-${i}`} href={item.href} className={styles.activityItem}>
              <div className={styles.activityItemHeader}>
                <span className={styles.activityItemTitle}>
                  {item.title}
                </span>
                <span className={styles.activityItemDate}>
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.activityItemDesc}>
                {item.description}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
