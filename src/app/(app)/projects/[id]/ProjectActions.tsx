'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EditProjectForm } from './EditProjectForm';
import { AssignSupervisorContent } from './assign/AssignSupervisorContent';
import styles from './ProjectLayout.module.css';

interface ProjectActionsProps {
  projectId: string;
  initialData: {
    projectName: string;
    description: string | null;
    location: string;
    status: string;
    startDate: string;
    expectedEndDate: string;
  };
}

export function ProjectActions({ projectId, initialData }: ProjectActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  return (
    <>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => setEditOpen(true)}>
          Edit
        </Button>
        <Button variant="secondary" onClick={() => setAssignOpen(true)}>
          Assign Supervisor
        </Button>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Project">
        <EditProjectForm
          projectId={projectId}
          initialData={initialData}
          onCancelPath={`/projects/${projectId}`}
          onCancel={() => setEditOpen(false)}
          onSuccess={() => {
            setEditOpen(false);
            router.refresh();
          }}
        />
      </Modal>

      <Modal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Assign Supervisor"
      >
        <AssignSupervisorContent projectId={projectId} />
      </Modal>
    </>
  );
}
