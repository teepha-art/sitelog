import React from 'react';
import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  message: string;
  action?: React.ReactNode;
}

export function ErrorState({ message, action }: ErrorStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <p className={styles.message}>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
