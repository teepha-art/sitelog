'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';
import { NavItem } from './Sidebar';

interface BottomNavProps {
  items: NavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();
  
  // Show max 4 items on bottom nav
  const displayItems = items.slice(0, 4);

  return (
    <nav className={styles.bottomNav}>
      {displayItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
