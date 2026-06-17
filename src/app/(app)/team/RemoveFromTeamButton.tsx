'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { removeFromTeam } from './actions';

interface RemoveFromTeamButtonProps {
  supervisorId: string;
  supervisorName: string;
}

export function RemoveFromTeamButton({ supervisorId, supervisorName }: RemoveFromTeamButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    const result = await removeFromTeam(supervisorId);
    setLoading(false);

    if (result.ok) {
      setIsOpen(false);
      router.refresh();
    }
  }, [supervisorId, router]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          marginTop: '12px',
          fontFamily: 'var(--font-body-medium-font-family)',
          fontSize: 'var(--font-body-medium-font-size)',
          color: 'var(--color-error)',
          cursor: 'pointer',
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
        }}
      >
        Remove from team
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => { if (!loading) setIsOpen(false); }}
        title={`Remove ${supervisorName} from your team?`}
      >
        <p style={{
          fontFamily: 'var(--font-body-medium-font-family)',
          fontSize: 'var(--font-body-medium-font-size)',
          color: 'var(--color-on-surface-variant)',
          margin: '0 0 24px 0',
          lineHeight: '1.5',
        }}>
          Their account will remain, but they will no longer be linked to your team or have access to your projects.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={loading}
          >
            Remove
          </Button>
        </div>
      </Modal>
    </>
  );
}
