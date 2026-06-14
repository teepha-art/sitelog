'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from './BackButton.module.css';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => router.back()}
      aria-label="Go back"
    >
      <ArrowLeft size={24} />
    </button>
  );
}
