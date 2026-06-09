import React from 'react';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || session.role !== Role.project_manager) notFound();

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  if (!user) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ 
        fontFamily: 'var(--font-headline-medium-font-family)', 
        fontSize: 'var(--font-headline-medium-font-size)',
        marginBottom: '24px'
      }}>
        Settings
      </h1>
      
      <SettingsForm user={{ fullName: user.fullName, email: user.email, profileImageUrl: user.profileImageUrl }} />
    </div>
  );
}
