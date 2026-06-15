'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { createProject } from '../actions';
import styles from './ProjectForm.module.css';

export function ProjectForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function actionHandler(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await createProject(formData);

    if (result.ok) {
      router.push(`/projects/${result.data}`);
      router.refresh();
    } else {
      setError(result.error.message);
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      {error && (
        <div className={styles.alert}>
          {error}
        </div>
      )}

      <form action={actionHandler} className={styles.form}>
        <Input label="Project Name" name="projectName" required disabled={isLoading} />
        <Input label="Project Code" name="projectCode" required disabled={isLoading} />

        <div className={styles.fullWidth}>
          <TextArea label="Description" name="description" disabled={isLoading} />
        </div>

        <Input label="Location" name="location" required disabled={isLoading} />

        <div className={styles.dateInputWrapper}>
          <Input label="Start Date" name="startDate" type="date" required disabled={isLoading} />
        </div>

        <div className={styles.dateInputWrapper}>
          <Input label="Expected End Date" name="expectedEndDate" type="date" required disabled={isLoading} />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
}
