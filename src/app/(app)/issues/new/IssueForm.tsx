'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { FileUpload } from '@/components/ui/FileUpload';
import { createIssue } from '../actions';
import { PRIORITIES } from '@/lib/constants';
import styles from './IssueForm.module.css';

interface IssueFormProps {
  projects: { id: string, name: string }[];
}

export function IssueForm({ projects }: IssueFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createIssue(formData);

    if (result.ok) {
      const issueId = result.data;

      // Upload file if selected
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        fileData.append('entityType', 'issue');
        fileData.append('entityId', String(issueId));

        try {
          const res = await fetch('/api/attachments', {
            method: 'POST',
            body: fileData,
          });
          if (!res.ok) {
            console.error('File upload failed:', await res.text());
          }
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          // Non-fatal, we continue
        }
      }

      router.push(`/issues/${issueId}`);
      router.refresh();
    } else {
      setError(result.error.message);
      setIsLoading(false);
    }
  };

  const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));
  const priorityOptions = PRIORITIES.map(p => ({
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

        <Input
          label="Issue Title"
          name="title"
          required
          disabled={isLoading}
        />

        <div className={styles.fullWidth}>
          <TextArea
            label="Description"
            name="description"
            placeholder="Describe the issue in detail..."
            required
            disabled={isLoading}
          />
        </div>

        <Select
          label="Priority"
          name="priority"
          options={priorityOptions}
          required
          disabled={isLoading}
        />

        <div className={styles.fullWidth}>
          <div className={styles.fileUploadSection}>
            <FileUpload
              entityType="issue"
              onFileSelect={setSelectedFile}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.submitSection}>
          <Button type="submit" fullWidth loading={isLoading}>
            Report Issue
          </Button>
        </div>
      </form>
    </div>
  );
}
