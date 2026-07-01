'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { allowRejoin } from './actions';

interface AllowRejoinButtonProps {
  supervisorId: string;
  supervisorName: string;
}

export function AllowRejoinButton({ supervisorId, supervisorName }: AllowRejoinButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    const result = await allowRejoin(supervisorId);
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
          color: 'var(--color-primary)',
          cursor: 'pointer',
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
        }}
      >
        Allow to rejoin
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => { if (!loading) setIsOpen(false); }}
        title={`Allow ${supervisorName} to rejoin your team?`}
      >
        <p style={{
          fontFamily: 'var(--font-body-medium-font-family)',
          fontSize: 'var(--font-body-medium-font-size)',
          color: 'var(--color-on-surface-variant)',
          margin: '0 0 24px 0',
          lineHeight: '1.5',
        }}>
          This will clear the block so they can rejoin using your invite code. They will not be automatically re-added to any projects.
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
            variant="primary"
            onClick={handleConfirm}
            loading={loading}
          >
            Allow to Rejoin
          </Button>
        </div>
      </Modal>
    </>
  );
}
