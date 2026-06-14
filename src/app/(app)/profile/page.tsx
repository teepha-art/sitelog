import React from 'react';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BackButton } from '@/components/ui/BackButton';
import { ProfileForm } from './ProfileForm';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  if (!user) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <BackButton />
        <h1 style={{ 
          fontFamily: 'var(--font-headline-medium-font-family)', 
          fontSize: 'var(--font-headline-medium-font-size)',
          margin: 0
        }}>
          Profile
        </h1>
      </div>
      
      <ProfileForm user={{ fullName: user.fullName, email: user.email, role: user.role, createdAt: user.createdAt, profileImageUrl: user.profileImageUrl }} />
    </div>
  );
}
