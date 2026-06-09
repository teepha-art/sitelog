import React from 'react';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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
      <h1 style={{ 
        fontFamily: 'var(--font-headline-medium-font-family)', 
        fontSize: 'var(--font-headline-medium-font-size)',
        marginBottom: '24px'
      }}>
        Profile
      </h1>
      
      <ProfileForm user={{ fullName: user.fullName, email: user.email, role: user.role, createdAt: user.createdAt, profileImageUrl: user.profileImageUrl }} />
    </div>
  );
}
