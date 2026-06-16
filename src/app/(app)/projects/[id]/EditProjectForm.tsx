'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { updateProject } from '../actions';
import { PROJECT_STATUSES } from '@/lib/constants';
import styles from './EditProjectForm.module.css';

interface EditProjectFormProps {
  projectId: string;
  initialData: {
    projectName: string;
    description: string | null;
    location: string;
    status: string;
    startDate: string;
    expectedEndDate: string;
  };
  onCancelPath: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function EditProjectForm({ projectId, initialData, onCancelPath, onCancel, onSuccess }: EditProjectFormProps) {
  const router = useRouter();
  const [projectName, setProjectName] = useState(initialData.projectName);
  const [description, setDescription] = useState(initialData.description || '');
  const [location, setLocation] = useState(initialData.location);
  const [status, setStatus] = useState(initialData.status);
  const [startDate, setStartDate] = useState(initialData.startDate);
  const [expectedEndDate, setExpectedEndDate] = useState(initialData.expectedEndDate);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateDates(): boolean {
    if (startDate && expectedEndDate && new Date(expectedEndDate) <= new Date(startDate)) {
      setError('Expected end date must be after the start date.');
      return false;
    }
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validateDates()) {
      setIsLoading(false);
      return;
    }

    const result = await updateProject(projectId, {
      projectName,
      description,
      location,
      status,
      startDate,
      expectedEndDate,
    });

    if (result.ok) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(onCancelPath);
        router.refresh();
      }
    } else {
      setError(result.error.message);
      setIsLoading(false);
    }
  };

  const statusOptions = PROJECT_STATUSES.map(s => ({
    value: s,
    label: s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  return (
    <div className={styles.wrapper}>
      {error && (
        <div className={styles.alert}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} required disabled={isLoading} />
        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required disabled={isLoading} />

        <div className={styles.fullWidth}>
          <TextArea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading} />
        </div>

        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={statusOptions} required disabled={isLoading} />

        <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required disabled={isLoading} />

        <Input label="Expected End Date" type="date" value={expectedEndDate} onChange={(e) => setExpectedEndDate(e.target.value)} required disabled={isLoading} />

        <div className={styles.formActions}>
          <Button variant="ghost" onClick={() => (onCancel ? onCancel() : router.push(onCancelPath))} disabled={isLoading}>Cancel</Button>
          <Button type="submit" loading={isLoading}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
