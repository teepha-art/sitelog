import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { MaterialForm } from './MaterialForm';
import { redirect } from 'next/navigation';
import styles from './NewMaterialPage.module.css';

export default async function NewMaterialRequestPage() {
  const session = await getSession();
  if (!session || session.role !== Role.site_supervisor) {
    redirect('/materials');
  }

  const projects = await prisma.project.findMany({
    where: { memberships: { some: { userId: session.userId } }, status: 'active' },
    select: { id: true, projectName: true },
    orderBy: { projectName: 'asc' }
  });

  return (
    <div>
      <h1 className={styles.pageTitle}>
        Request Materials
      </h1>
      
      {projects.length === 0 ? (
        <div className={styles.emptyMessage}>
          You must be assigned to an active project to request materials.
        </div>
      ) : (
        <MaterialForm projects={projects.map(p => ({ id: p.id, name: p.projectName }))} />
      )}
    </div>
  );
}
