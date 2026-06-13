'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './PricingSection.module.css';

function CheckIcon() {
  return (
    <svg className={styles.check} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);
  const [card2Tier, setCard2Tier] = useState<'starter' | 'premium'>('starter');
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const baseMonthly = card2Tier === 'starter' ? 19 : 49;
  const card2Price = isYearly ? baseMonthly * 10 : baseMonthly;

  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const scrollLeft = trackRef.current.scrollLeft;
    const children = Array.from(trackRef.current.children);
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs((child as HTMLElement).offsetLeft - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    if (closest !== current) setCurrent(closest);
  }, [current]);

  return (
    <section id="pricing" className={styles.pricing}>
      <div className={styles.header}>
        <h2 className={styles.title}>Simple, predictable<br />pricing</h2>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${!isYearly ? styles.active : ''}`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </button>
          <button
            className={`${styles.toggleBtn} ${isYearly ? styles.active : ''}`}
            onClick={() => setIsYearly(true)}
          >
            Yearly (Save ~17%)
          </button>
        </div>
      </div>

      <div ref={trackRef} className={styles.grid} onScroll={handleScroll}>
        {/* Free Plan */}
        <div className={styles.card}>
          <h3 className={styles.planName}>Free</h3>
          <p className={styles.planDesc}>Get started with basic construction site reporting.</p>
          <div className={styles.price}>
            $0 <span className={styles.period}>/ mo</span>
          </div>
          <ul className={styles.features}>
            <li className={styles.feature}><CheckIcon /> 1 Project Manager</li>
            <li className={styles.feature}><CheckIcon /> 1 site supervisor</li>
            <li className={styles.feature}><CheckIcon /> 1 active project</li>
            <li className={styles.feature}><CheckIcon /> Core reporting, issues & material requests</li>
          </ul>
          <Link href="/auth?mode=signup" tabIndex={-1}>
            <Button variant="secondary" fullWidth>Get Started</Button>
          </Link>
        </div>

        {/* Starter / Premium Plan (Most Popular) */}
        <div className={`${styles.card} ${styles.cardPopular}`}>
          <div className={styles.popularBadge}>Most Popular</div>
          <h3 className={styles.planName}>{card2Tier === 'starter' ? 'Starter' : 'Premium'}</h3>
          <p className={styles.planDesc}>
            {card2Tier === 'starter'
              ? 'For independent project managers with a few sites.'
              : 'For growing firms managing multiple concurrent sites.'}
          </p>

          {/* Internal tier toggle */}
          <div className={styles.tierToggle}>
            <button
              className={`${styles.tierBtn} ${card2Tier === 'starter' ? styles.tierActive : ''}`}
              onClick={() => setCard2Tier('starter')}
            >
              Starter
            </button>
            <button
              className={`${styles.tierBtn} ${card2Tier === 'premium' ? styles.tierActive : ''}`}
              onClick={() => setCard2Tier('premium')}
            >
              Premium
            </button>
          </div>

          <div className={styles.price}>
            ${card2Price}<span className={styles.period}>/ mo</span>
          </div>

          <ul className={styles.features}>
            {card2Tier === 'starter' ? (
              <>
                <li className={styles.feature}><CheckIcon /> 1 Project Manager</li>
                <li className={styles.feature}><CheckIcon /> Up to 3 site supervisors</li>
                <li className={styles.feature}><CheckIcon /> Up to 2 active projects</li>
                <li className={styles.feature}><CheckIcon /> Photo attachments</li>
              </>
            ) : (
              <>
                <li className={styles.feature}><CheckIcon /> 1 Project Manager</li>
                <li className={styles.feature}><CheckIcon /> Up to 15 site supervisors</li>
                <li className={styles.feature}><CheckIcon /> Unlimited active projects</li>
                <li className={styles.feature}><CheckIcon /> Everything in Starter</li>
                <li className={styles.feature}><CheckIcon /> Priority email support</li>
              </>
            )}
          </ul>
          <Link href="/auth?mode=signup" tabIndex={-1}>
            <Button fullWidth>Get Started</Button>
          </Link>
        </div>

        {/* Business Plan */}
        <div className={styles.card}>
          <h3 className={styles.planName}>Business</h3>
          <p className={styles.planDesc}>For large contractors requiring unlimited scale.</p>
          <div className={styles.price}>
            ${isYearly ? '1,490' : '149'}<span className={styles.period}>/ mo</span>
          </div>
          <ul className={styles.features}>
            <li className={styles.feature}><CheckIcon /> Multiple Project Managers</li>
            <li className={styles.feature}><CheckIcon /> Unlimited site supervisors</li>
            <li className={styles.feature}><CheckIcon /> Unlimited active projects</li>
            <li className={styles.feature}><CheckIcon /> Advanced reporting & analytics</li>
            <li className={styles.feature}><CheckIcon /> Dedicated support</li>
          </ul>
          <Link href="/auth?mode=signup" tabIndex={-1}>
            <Button variant="secondary" fullWidth>Get Started</Button>
          </Link>
        </div>
      </div>

      <div className={styles.dots}>
        {[0, 1, 2].map(i => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => {
              if (trackRef.current) {
                const child = trackRef.current.children[i] as HTMLElement;
                if (child) child.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
              }
            }}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
