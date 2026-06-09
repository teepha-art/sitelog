'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { updateRequestStatus } from '../actions';
import { REQUEST_STATUSES } from '@/lib/constants';
import styles from './StatusUpdateForm.module.css';

interface StatusUpdateFormProps {
  requestId: string;
  currentStatus: string;
}

export default function StatusUpdateForm({ requestId, currentStatus }: StatusUpdateFormProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === currentStatus) return;
    
    setIsLoading(true);
    await updateRequestStatus(requestId, status);
    setIsLoading(false);
  };

  const options = REQUEST_STATUSES.map(s => ({
    value: s,
    label: s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.selectWrapper}>
        <Select 
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={options}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" loading={isLoading} disabled={status === currentStatus}>
        Update
      </Button>
    </form>
  );
}
