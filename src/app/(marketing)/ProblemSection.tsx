'use client';

import { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ProblemSection.module.css';

const cards = [
  {
    title: 'Issues reported too late',
    desc: 'By the time you hear about a delay, it\u2019s already cost you money. SiteLog gets issues to you instantly.',
    gradient: 'linear-gradient(135deg, var(--color-primary-container), var(--color-primary))',
  },
  {
    title: 'Material requests lost',
    desc: 'Stop scrolling through chat history to figure out what materials your team needs and when.',
    gradient: 'linear-gradient(135deg, var(--color-secondary-container), var(--color-secondary))',
  },
  {
    title: 'No permanent record',
    desc: 'Keep a structured, searchable history of every report, issue, and request for compliance and disputes.',
    gradient: 'linear-gradient(135deg, var(--color-tertiary-container), var(--color-tertiary))',
  },
];

export function ProblemSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const total = cards.length;

  const goNext = useCallback(() => {
    if (!trackRef.current || current >= total - 1) return;
    const child = trackRef.current.children[current + 1] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      setCurrent(c => c + 1);
    }
  }, [current, total]);

  const goPrev = useCallback(() => {
    if (!trackRef.current || current <= 0) return;
    const child = trackRef.current.children[current - 1] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      setCurrent(c => c - 1);
    }
  }, [current]);

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
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 className={styles.sectionTitle}>
            Built to stop <span className={styles.sectionTitleHighlight}>the chaos</span>
          </h2>
          <div className={styles.arrows}>
            <button onClick={goPrev} disabled={current === 0} className={styles.arrow} aria-label="Previous card">
              <ChevronLeft size={20} />
            </button>
            <button onClick={goNext} disabled={current === total - 1} className={styles.arrow} aria-label="Next card">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className={styles.carousel}>
          {cards.map((card, index) => (
            <div key={index} className={styles.card} style={{ flex: 1 }}>
              <div className={styles.cardImage} style={{ background: card.gradient }} />
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.mobileCarousel}>
          <div ref={trackRef} className={styles.track} onScroll={handleScroll}>
            {cards.map((card, index) => (
              <div key={index} className={styles.mobileCard}>
                <div className={styles.cardImage} style={{ background: card.gradient }} />
                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
