import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './ClosingCta.module.css';

export function ClosingCta() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          <span className={styles.headingDark}>Stop calling. </span>
          <span className={styles.headingPrimary}>Start seeing.</span>
        </h2>
        <p className={styles.subtitle}>
          Bring every site into one view &mdash; no phone calls required.
        </p>
        <Link href="/auth?mode=signup" tabIndex={-1}>
          <Button size="lg">
            Get Started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Button>
        </Link>
      </div>
    </section>
  );
}
