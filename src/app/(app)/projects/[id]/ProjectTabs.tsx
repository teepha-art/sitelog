'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ProjectLayout.module.css';

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const basePath = `/projects/${projectId}`;

  const tabs = [
    { href: basePath, label: 'Recent Activity' },
    { href: `${basePath}/reports`, label: 'Reports' },
    { href: `${basePath}/issues`, label: 'Issues' },
    { href: `${basePath}/materials`, label: 'Material Requests' },
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={isActive ? styles.tabActive : styles.tab}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
