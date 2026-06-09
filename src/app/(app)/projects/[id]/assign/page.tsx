'use client';

import React from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AssignSupervisorContent } from './AssignSupervisorContent';
import styles from './AssignSupervisor.module.css';

export default function AssignSupervisorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <Card padding="lg" className={styles.card}>
      <h2 className={styles.title}>Assign Supervisor</h2>
      <div className={styles.doneRow}>
        <Button variant="ghost" onClick={() => router.push(`/projects/${id}`)}>
          Done
        </Button>
      </div>
      <AssignSupervisorContent projectId={id} />
    </Card>
  );
}
