'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { searchSupervisors, assignSupervisor } from './actions';
import styles from './AssignSupervisor.module.css';

interface AssignSupervisorContentProps {
  projectId: string;
}

export function AssignSupervisorContent({ projectId }: AssignSupervisorContentProps) {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; fullName: string; email: string }[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 2) return;

    setIsSearching(true);
    setHasSearched(false);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await searchSupervisors(query);
      setResults(res);
      setHasSearched(true);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssign = async (userId: string) => {
    setAssigningId(userId);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await assignSupervisor(projectId, userId);
      if (res.ok) {
        setSuccessMessage('Supervisor assigned successfully.');
        router.refresh();
      } else {
        setError(res.error.message);
      }
    } catch {
      setError('Assignment failed. Please try again.');
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div>
      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>
      )}
      {successMessage && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>{successMessage}</div>
      )}

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchField}>
          <Input
            label="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type at least 2 characters..."
          />
        </div>
        <div className={styles.searchButton}>
          <Button type="submit" loading={isSearching}>
            Search
          </Button>
        </div>
      </form>

      {hasSearched && results.length === 0 && (
        <p className={styles.noResults}>No supervisors found matching that name or email.</p>
      )}

      {results.length > 0 && (
        <div className={styles.results}>
          {results.map((user) => (
            <div key={user.id} className={styles.resultItem}>
              <div>
                <div className={styles.resultName}>{user.fullName}</div>
                <div className={styles.resultEmail}>{user.email}</div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleAssign(user.id)}
                loading={assigningId === user.id}
                disabled={assigningId !== null}
              >
                Assign
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
