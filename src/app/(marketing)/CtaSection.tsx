'use client';

import React from 'react';
import { TriangleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './CtaSection.module.css';



export function CtaSection() {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.tape}
        initial={{ rotate: -1.5 }}
        whileInView={{ rotate: -1.5 }}
        viewport={{ once: true }}
      >
        {/* Top hazard stripe border */}
        <div className={styles.stripeTop} />

        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            <span className={styles.marqueeText}>
              BUILT FOR PROJECT MANAGERS{' '}
              <TriangleAlert className={styles.triangle} size={28} />{' '}
              MADE FOR SITE SUPERVISORS{' '}
              <TriangleAlert className={styles.triangle} size={28} />{' '}
              ENGINEERED FOR EVERY SITE{' '}
              <TriangleAlert className={styles.triangle} size={28} />{' '}
            </span>
            <span className={styles.marqueeText}>
              BUILT FOR PROJECT MANAGERS{' '}
              <TriangleAlert className={styles.triangle} size={28} />{' '}
              MADE FOR SITE SUPERVISORS{' '}
              <TriangleAlert className={styles.triangle} size={28} />{' '}
              ENGINEERED FOR EVERY SITE{' '}
              <TriangleAlert className={styles.triangle} size={28} />{' '}
            </span>
          </div>
        </div>

        {/* Bottom hazard stripe border */}
        <div className={styles.stripeBottom} />
      </motion.div>
    </section>
  );
}
