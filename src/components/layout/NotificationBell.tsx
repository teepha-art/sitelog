'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './NotificationBell.module.css';

interface Notification {
  id: string;
  type: string;
  message: string;
  readStatus: boolean;
  relatedEntityType: string;
  relatedEntityId: string;
  createdAt: string;
}

interface NotificationBellProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationBell({ isOpen, onOpenChange }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => {
    fetchNotifications();

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChangeRef.current(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpen = async () => {
    const next = !isOpen;
    onOpenChange(next);

    // If opening and we have unread, mark them as read on the server
    if (next && unreadCount > 0) {
      setUnreadCount(0); // optimistic UI update
      try {
        await fetch('/api/notifications', { method: 'POST' });
        // update local state
        setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getHref = (type: string | null, id: string | null) => {
    if (!type || !id) return '/dashboard';
    if (type === 'report' || type === 'daily_report') return `/reports/${id}`;
    if (type === 'issue') return `/issues/${id}`;
    if (type === 'material_request') return `/materials/${id}`;
    if (type === 'project') return `/projects/${id}`;
    return '/dashboard';
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button className={styles.bell} onClick={handleOpen} aria-label="Notifications">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>Notifications</div>
          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>You have no notifications.</div>
            ) : (
              notifications.map((notif) => (
                <Link 
                  key={notif.id} 
                  href={getHref(notif.relatedEntityType, notif.relatedEntityId)}
                  className={`${styles.item} ${!notif.readStatus ? styles.unread : ''}`}
                  onClick={() => onOpenChange(false)}
                >
                  <div className={styles.message}>{notif.message}</div>
                  <div className={styles.time}>{new Date(notif.createdAt).toLocaleDateString()}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
