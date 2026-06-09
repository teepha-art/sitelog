'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationBell } from './NotificationBell';
import styles from './Topbar.module.css';
import { Role } from '@prisma/client';

interface TopbarProps {
  title: string;
  userName: string;
  userRole: Role;
  userProfileImageUrl: string | null;
}

export function Topbar({ title, userName, userRole, userProfileImageUrl }: TopbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = userName.substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth');
    router.refresh();
  };

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.actions}>
        <NotificationBell />

        <div className={styles.userMenu} onClick={() => setMenuOpen(!menuOpen)}>
          <div className={styles.avatar}>
            {userProfileImageUrl ? (
              <img src={userProfileImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              initials
            )}
          </div>
          <span className={styles.name}>{userName}</span>
          
          {menuOpen && (
            <div className={styles.dropdown}>
              {userRole === Role.project_manager ? (
                <button className={styles.dropdownItem} onClick={() => router.push('/settings')}>
                  Settings
                </button>
              ) : (
                <button className={styles.dropdownItem} onClick={() => router.push('/profile')}>
                  Profile
                </button>
              )}
              <button className={styles.dropdownItem} onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
