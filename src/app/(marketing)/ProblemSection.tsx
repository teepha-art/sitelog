'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ProblemSection.module.css';

const cards = [
  {
    title: 'Sign up & choose your role',
    desc: 'Create your account and choose your role \u2014 your dashboard adapts to how you work.',
    image: '/landing/digital_02.png',
  },
  {
    title: 'Create a project',
    desc: 'Set up your project and assign your team in seconds.',
    image: '/landing/digital_01.jpeg',
  },
  {
    title: 'Track issues',
    desc: 'Log issues, reports, and material requests \u2014 all tracked in one place.',
    image: '/landing/report_03.jpeg',
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
            How it works
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
              <div className={styles.cardImage}>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className={styles.cardImg}
                  sizes="(max-width: 767px) 100vw, 33vw"
                />
              </div>
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
                <div className={styles.cardImage}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className={styles.cardImg}
                    sizes="(max-width: 767px) 90vw, 33vw"
                  />
                </div>
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
