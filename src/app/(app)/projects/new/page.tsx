import React from 'react';
import { ProjectForm } from './ProjectForm';
import styles from './NewProjectPage.module.css';

export default function NewProjectPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>
        Create New Project
      </h1>
      <ProjectForm />
    </div>
  );
}
