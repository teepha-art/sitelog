'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDefinition {
  key: string;
  label: string;
  options: FilterOption[];
  type: 'select' | 'date'; // we can expand this later
}

interface FilterBarProps {
  filters: FilterDefinition[];
}

export function FilterBar({ filters }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Local state to hold filter values before applying
  const [localState, setLocalState] = useState<Record<string, string>>({});

  useEffect(() => {
    const current: Record<string, string> = {};
    filters.forEach(f => {
      const val = searchParams.get(f.key);
      if (val) current[f.key] = val;
    });
    setLocalState(current);
  }, [searchParams, filters]);

  const handleChange = (key: string, value: string) => {
    setLocalState(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(localState).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setLocalState({});
    router.push(pathname);
  };

  const hasActiveFilters = Object.values(localState).some(v => !!v);

  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      alignItems: 'flex-end', 
      flexWrap: 'wrap',
      padding: '16px',
      backgroundColor: 'var(--color-surface)',
      borderRadius: '12px',
      border: '1px solid var(--color-outline-variant)',
      marginBottom: '24px'
    }}>
      {filters.map((filter) => (
        <div key={filter.key} style={{ minWidth: '150px', flex: 1 }}>
          {filter.type === 'select' ? (
            <Select
              label={filter.label}
              value={localState[filter.key] || ''}
              onChange={(e) => handleChange(filter.key, e.target.value)}
              options={[{ label: 'All', value: '' }, ...filter.options]}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ 
                fontFamily: 'var(--font-label-medium-font-family)', 
                fontSize: 'var(--font-label-medium-font-size)',
                color: 'var(--color-on-surface)' 
              }}>
                {filter.label}
              </label>
              <input 
                type="date"
                value={localState[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                style={{
                  height: '44px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-outline-variant)',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-body-medium-font-family)',
                  fontSize: 'var(--font-body-medium-font-size)',
                  color: 'var(--color-on-surface)',
                  width: '100%',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}
        </div>
      ))}
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={handleApply}>Apply Filters</Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleClear}>Clear</Button>
        )}
      </div>
    </div>
  );
}
