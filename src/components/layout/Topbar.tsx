'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationBell } from './NotificationBell';
import { Loader2 } from 'lucide-react';
import styles from './Topbar.module.css';
import { Role } from '@prisma/client';

interface TopbarProps {
  title: string;
  subtitle?: string;
  userName: string;
  userRole: Role;
  userProfileImageUrl: string | null;
}

export function Topbar({ title, subtitle, userName, userRole, userProfileImageUrl }: TopbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const initials = userName.substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth');
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      
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
                <>
                  <div className={styles.mobileOnlyItem}>
                    <button className={styles.dropdownItem} onClick={() => router.push('/materials')}>
                      Materials
                    </button>
                    <button className={styles.dropdownItem} onClick={() => router.push('/team')}>
                      Team
                    </button>
                    <div className={styles.divider}></div>
                  </div>
                  <button className={styles.dropdownItem} onClick={() => router.push('/settings')}>
                    Settings
                  </button>
                </>
              ) : (
                <button className={styles.dropdownItem} onClick={() => router.push('/profile')}>
                  Profile
                </button>
              )}
              <button className={styles.dropdownItem} onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? (<><Loader2 size={16} className={styles.logoutSpinner} /> Logging out...</>) : 'Log out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
