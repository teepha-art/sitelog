import React from 'react';
import styles from './StatusChip.module.css';
import { ProjectStatus, IssueStatus, RequestStatus, Priority } from '@prisma/client';

export type StatusType = 'success' | 'warning' | 'error' | 'neutral';

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: ProjectStatus | IssueStatus | RequestStatus | Priority;
  variant?: 'solid' | 'outline';
}

const statusMap: Record<string, { label: string; type: StatusType }> = {
  // Projects
  [ProjectStatus.active]: { label: 'Active', type: 'success' },
  [ProjectStatus.delayed]: { label: 'Delayed', type: 'warning' },
  [ProjectStatus.on_hold]: { label: 'On Hold', type: 'neutral' },
  [ProjectStatus.completed]: { label: 'Completed', type: 'success' },
  
  // Issues
  [IssueStatus.open]: { label: 'Open', type: 'warning' },
  [IssueStatus.in_progress]: { label: 'In Progress', type: 'neutral' },
  [IssueStatus.resolved]: { label: 'Resolved', type: 'success' },
  
  // Priorities
  [Priority.low]: { label: 'Low Priority', type: 'neutral' },
  [Priority.medium]: { label: 'Medium Priority', type: 'warning' },
  [Priority.high]: { label: 'High Priority', type: 'error' },
  [Priority.critical]: { label: 'Critical', type: 'error' },
  
  // Requests
  [RequestStatus.pending]: { label: 'Pending', type: 'error' },
  [RequestStatus.approved]: { label: 'Approved', type: 'success' },
  [RequestStatus.rejected]: { label: 'Rejected', type: 'error' },
  [RequestStatus.fulfilled]: { label: 'Fulfilled', type: 'success' },
};

export const StatusChip = React.forwardRef<HTMLSpanElement, StatusChipProps>(
  ({ status, variant = 'solid', className = '', ...props }, ref) => {
    const config = statusMap[status] || { label: status, type: 'neutral' };
    
    const classNames = [
      styles.chip,
      styles[config.type],
      variant === 'outline' ? styles.outline : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classNames} {...props}>
        {config.label}
      </span>
    );
  }
);
StatusChip.displayName = 'StatusChip';
