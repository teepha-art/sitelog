'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { updateIssueStatus, assignIssue } from '../actions';
import { ISSUE_STATUSES } from '@/lib/constants';
import styles from './StatusUpdateForm.module.css';

interface StatusUpdateFormProps {
  issueId: string;
  currentStatus: string;
  currentAssigneeId: string | null;
  supervisors: { id: string; fullName: string }[];
}

export default function StatusUpdateForm({ issueId, currentStatus, currentAssigneeId, supervisors }: StatusUpdateFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [assigneeId, setAssigneeId] = useState(currentAssigneeId ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const statusChanged = status !== currentStatus;
    const assigneeChanged = assigneeId !== (currentAssigneeId ?? '');

    if (statusChanged) {
      await updateIssueStatus(issueId, status);
    }

    if (assigneeChanged && assigneeId) {
      await assignIssue(issueId, assigneeId);
    }
    setIsLoading(false);
    router.refresh();
  };

  const statusOptions = ISSUE_STATUSES.map(s => ({
    value: s,
    label: s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const assigneeOptions = supervisors.map(s => ({
    value: s.id,
    label: s.fullName,
  }));

  const canSubmit = status !== currentStatus || assigneeId !== (currentAssigneeId ?? '');

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.selectWrapper}>
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statusOptions}
          disabled={isLoading}
        />
      </div>
      {supervisors.length > 0 && (
        <div className={styles.selectWrapper}>
          <Select
            label="Assign To"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            options={assigneeOptions}
            disabled={isLoading}
          />
        </div>
      )}
      <Button type="submit" loading={isLoading} disabled={!canSubmit}>
        Update
      </Button>
    </form>
  );
}
