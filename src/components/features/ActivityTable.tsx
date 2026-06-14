'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { ActivityItem } from '@/lib/activity';
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

function getInitials(name: string): string {
  return name.substring(0, 2).toUpperCase();
}

export function ActivityTable({ items }: ActivityTableProps) {
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? items : items.slice(0, 4);

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
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Project</th>
              <th className={styles.th}>Activity</th>
              <th className={styles.th}>Date</th>
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
                    <Link href={item.href} className={styles.cellLink}>
                      <div className={styles.nameCell}>
                        <span className={styles.avatar}>{getInitials(item.userName)}</span>
                        <span className={styles.name}>{item.userName}</span>
                      </div>
                    </Link>
                  </td>
                  <td className={styles.td}>
                    <Link href={item.href} className={styles.cellLink}>
                      <span className={styles.projectName}>{item.projectName}</span>
                    </Link>
                  </td>
                  <td className={styles.td}>
                    <Link href={item.href} className={styles.cellLink}>
                      <span className={`${styles.pill} ${TYPE_COLORS[item.type] || ''}`}>
                        {TYPE_LABELS[item.type] || item.type}
                      </span>
                    </Link>
                  </td>
                  <td className={styles.td}>
                    <Link href={item.href} className={styles.cellLink}>
                      <span className={styles.date}>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
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
