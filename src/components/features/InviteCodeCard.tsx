'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import styles from './InviteCodeCard.module.css';

interface InviteCodeCardProps {
  inviteCode: string;
}

export function InviteCodeCard({ inviteCode }: InviteCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <Card padding="md">
      <div className={styles.wrapper}>
        <div className={styles.label}>
          Invite your team
        </div>
        <p className={styles.description}>
          Share this code with your Site Supervisors so they can join your team:
        </p>
        <div className={styles.codeRow}>
          <code className={styles.code}>{inviteCode}</code>
          <button
            type="button"
            className={styles.copyButton}
            onClick={handleCopy}
            aria-label="Copy invite code"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </Card>
  );
}
