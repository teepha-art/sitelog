'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { ActivityItem } from '@/lib/activity';
import { Avatar } from '@/components/ui/Avatar';
import styles from './ActivityTable.module.css';

interface ActivityTableProps {
  items: ActivityItem[];
}

const TYPE_LABELS: Record<string, string> = {
  report: 'Report',
  issue: 'Issue',
  material_request: 'Request',
};

const TYPE_COLORS: Record<string, string> = {
  report: styles.pillReport,
  issue: styles.pillIssue,
  material_request: styles.pillRequest,
};


export function ActivityTable({ items }: ActivityTableProps) {
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? items : items.slice(0, 4);

  function formatDateFull(date: Date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatDateMobile(date: Date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    return `${mm}-${dd}-${yy}`;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Activity</h2>
        <div className={styles.headerRight}>
          {items.length > 4 && (
            <button
              type="button"
              className={styles.viewAll}
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? 'Show less' : 'View all'}
            </button>
          )}
        </div>
      </div>

      <div className={`${styles.tableWrap} ${showAll ? styles.scrollable : ''}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.th} ${styles.alignLeft}`}>Name</th>
              <th className={`${styles.th} ${styles.alignCenter}`}>Project</th>
              <th className={`${styles.th} ${styles.alignCenter}`}>Activity</th>
              <th className={`${styles.th} ${styles.alignCenter}`}>Date</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.empty}>No recent activity to display.</td>
              </tr>
            ) : (
              displayItems.map((item, i) => (
                <tr key={`${item.id}-${i}`} className={styles.row}>
                  <td className={styles.td}>
                    <Link href={item.href} className={`${styles.cellLink} ${styles.cellLinkLeft}`}>
                      <div className={styles.nameCell}>
                        <Avatar name={item.userName} imageUrl={item.userProfileImageUrl} size={28} className={styles.avatarOverride} />
                        <span className={styles.name} data-tooltip={item.userName}>{item.userName}</span>
                      </div>
                    </Link>
                  </td>
                  <td className={styles.td}>
                    <Link href={item.href} className={`${styles.cellLink} ${styles.cellLinkCenter}`}>
                      <span className={styles.projectName} data-tooltip={item.projectName}>{item.projectName}</span>
                    </Link>
                  </td>
                  <td className={styles.td}>
                    <Link href={item.href} className={`${styles.cellLink} ${styles.cellLinkCenter}`}>
                      <span className={`${styles.pill} ${TYPE_COLORS[item.type] || ''}`}>
                        {TYPE_LABELS[item.type] || item.type}
                      </span>
                    </Link>
                  </td>
                  <td className={styles.td}>
                    <Link href={item.href} className={`${styles.cellLink} ${styles.cellLinkCenter}`}>
                      <span className={styles.date}>
                        <span className={styles.dateFull}>{formatDateFull(item.date)}</span>
                        <span className={styles.dateMobile}>{formatDateMobile(item.date)}</span>
                      </span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
