import React from 'react';
import Link from 'next/link';
import styles from './KpiCard.module.css';

interface KpiCardProps {
  label: string;
  value: number;
  href: string;
  variant?: 'default' | 'warning' | 'error';
}

export function KpiCard({ label, value, href, variant = 'default' }: KpiCardProps) {
  return (
    <Link href={href} className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </Link>
  );
}
