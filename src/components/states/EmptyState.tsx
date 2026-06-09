import React from 'react';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  message: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ message, action, icon }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <p className={styles.message}>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
