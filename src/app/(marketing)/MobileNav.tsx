'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';
import styles from './MobileNav.module.css';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className={styles.root}>
      <button
        className={styles.hamburger}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <nav className={styles.menu}>
            <a
              href="#pricing"
              className={styles.menuItem}
              onClick={() => setOpen(false)}
            >
              Pricing
            </a>
            <Link
              href="/auth?mode=login"
              className={styles.menuItem}
              onClick={() => setOpen(false)}
            >
              Log In
            </Link>
            <div className={styles.menuAction}>
              <Link href="/auth?mode=signup" onClick={() => setOpen(false)}>
                <Button fullWidth>Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
