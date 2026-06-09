'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { createMaterialRequest } from '../actions';
import { PRIORITIES } from '@/lib/constants';
import styles from './MaterialForm.module.css';

interface MaterialFormProps {
  projects: { id: string, name: string }[];
}

export function MaterialForm({ projects }: MaterialFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createMaterialRequest(formData);

    if (result.ok) {
      router.push(`/materials/${result.data}`);
      router.refresh();
    } else {
      setError(result.error.message);
      setIsLoading(false);
    }
  };

  const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));
  const urgencyOptions = PRIORITIES.map(p => ({
    value: p,
    label: p.charAt(0).toUpperCase() + p.slice(1)
  }));

  return (
    <div className={styles.wrapper}>
      {error && (
        <div className={styles.alert}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Select
          label="Project"
          name="projectId"
          options={projectOptions}
          required
          disabled={isLoading}
        />

        <Select
          label="Urgency Level"
          name="urgencyLevel"
          options={urgencyOptions}
          required
          disabled={isLoading}
        />

        <Input
          label="Material Name"
          name="materialName"
          placeholder="e.g., Cement bags"
          required
          disabled={isLoading}
        />

        <Input
          label="Quantity"
          name="quantity"
          placeholder="e.g., 50"
          required
          disabled={isLoading}
        />

        <div className={styles.fullWidth}>
          <TextArea
            label="Notes (Optional)"
            name="notes"
            placeholder="Any specific instructions or delivery details..."
            disabled={isLoading}
          />
        </div>

        <div className={styles.submitSection}>
          <Button type="submit" fullWidth loading={isLoading}>
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
}
