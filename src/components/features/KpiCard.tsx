import React from 'react';
import Link from 'next/link';
import styles from './KpiCard.module.css';

interface KpiCardProps {
  label: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  accent?: boolean;
}

export function KpiCard({ label, value, href, icon, accent = false }: KpiCardProps) {
  return (
    <Link href={href} className={`${styles.card} ${accent ? styles.accent : ''}`}>
      <div className={styles.topRow}>
        <span className={styles.iconWrap}>
          {icon}
        </span>
        <span className={`${styles.label} ${accent ? styles.accentLabel : ''}`}>{label}</span>
      </div>
      <div className={`${styles.value} ${accent ? styles.accentValue : ''}`}>{value}</div>
    </Link>
  );
}
