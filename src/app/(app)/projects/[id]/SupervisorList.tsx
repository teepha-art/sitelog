'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { removeSupervisor } from './assign/actions';
import styles from './SupervisorList.module.css';

interface SupervisorListProps {
  projectId: string;
  memberships: { userId: string; fullName: string; email: string }[];
}

export function SupervisorList({ projectId, memberships }: SupervisorListProps) {
  const router = useRouter();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (userId: string) => {
    setRemovingId(userId);
    const result = await removeSupervisor(projectId, userId);
    if (result.ok) {
      router.refresh();
    }
    setRemovingId(null);
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        Assigned Supervisors ({memberships.length})
      </h3>
      <div className={styles.list}>
        {memberships.map((m) => (
          <div key={m.userId} className={styles.item}>
            <div>
              <div className={styles.name}>{m.fullName}</div>
              <div className={styles.email}>{m.email}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleRemove(m.userId)}
              loading={removingId === m.userId}
              disabled={removingId !== null}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}