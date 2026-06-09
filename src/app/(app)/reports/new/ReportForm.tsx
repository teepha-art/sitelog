'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { FileUpload } from '@/components/ui/FileUpload';
import { submitReport } from '../actions';
import { PROGRESS_MIN, PROGRESS_MAX } from '@/lib/constants';
import styles from './ReportForm.module.css';

interface ReportFormProps {
  projects: { id: string, name: string }[];
}

export function ReportForm({ projects }: ReportFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [projectId, setProjectId] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [weatherCondition, setWeatherCondition] = useState('');
  const [completedWork, setCompletedWork] = useState('');
  const [delays, setDelays] = useState('');
  const [progressPercentage, setProgressPercentage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load drafts
  useEffect(() => {
    const draft = localStorage.getItem('sitelog_report_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.projectId) setProjectId(parsed.projectId);
        if (parsed.reportDate) setReportDate(parsed.reportDate);
        if (parsed.weatherCondition) setWeatherCondition(parsed.weatherCondition);
        if (parsed.completedWork) setCompletedWork(parsed.completedWork);
        if (parsed.delays) setDelays(parsed.delays);
        if (parsed.progressPercentage) setProgressPercentage(parsed.progressPercentage);
      } catch (e) {
        // ignore malformed draft
      }
    }
  }, []);

  // Save drafts
  useEffect(() => {
    const draft = {
      projectId, reportDate, weatherCondition, completedWork, delays, progressPercentage
    };
    localStorage.setItem('sitelog_report_draft', JSON.stringify(draft));
  }, [projectId, reportDate, weatherCondition, completedWork, delays, progressPercentage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('reportDate', reportDate);
    formData.append('weatherCondition', weatherCondition);
    formData.append('completedWork', completedWork);
    formData.append('delays', delays);
    formData.append('progressPercentage', progressPercentage);

    const result = await submitReport(formData);

    if (result.ok) {
      const reportId = result.data;

      // Upload file if selected
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        fileData.append('entityType', 'daily_report');
        fileData.append('entityId', String(reportId));

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

      localStorage.removeItem('sitelog_report_draft');
      router.push(`/reports/${reportId}`);
      router.refresh();
    } else {
      setError(result.error.message);
      setIsLoading(false);
    }
  };

  const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));

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
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          options={projectOptions}
          required
          disabled={isLoading}
        />

        <Input
          label="Report Date"
          type="date"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          label="Weather Condition"
          value={weatherCondition}
          onChange={(e) => setWeatherCondition(e.target.value)}
          placeholder="e.g., Sunny, 25°C"
          disabled={isLoading}
        />

        <Input
          label="Overall Progress (%)"
          type="number"
          value={progressPercentage}
          onChange={(e) => setProgressPercentage(e.target.value)}
          required
          disabled={isLoading}
          min={PROGRESS_MIN}
          max={PROGRESS_MAX}
        />

        <div className={styles.fullWidth}>
          <TextArea
            label="Completed Work"
            value={completedWork}
            onChange={(e) => setCompletedWork(e.target.value)}
            placeholder="What was achieved today?"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.fullWidth}>
          <TextArea
            label="Delays (Optional)"
            value={delays}
            onChange={(e) => setDelays(e.target.value)}
            placeholder="Note any problems or delays."
            disabled={isLoading}
          />
        </div>

        <div className={styles.fullWidth}>
          <div className={styles.fileUploadSection}>
            <FileUpload
              entityType="daily_report"
              onFileSelect={setSelectedFile}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.submitSection}>
          <Button type="submit" fullWidth loading={isLoading}>
            Submit Report
          </Button>
        </div>
      </form>
    </div>
  );
}
