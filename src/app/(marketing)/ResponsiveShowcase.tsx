'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './ResponsiveShowcase.module.css';

export function ResponsiveShowcase() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Your projects, on every screen</h2>
        <p className={styles.subtitle}>
          Report from the field, monitor from anywhere — on any device.
        </p>

        <div className={styles.cluster}>
          <div className={`${styles.deviceWrapper} ${styles.desktopWrapper}`}>
            <div className={styles.desktopFrame}>
              <Image
                src="/landing/project_desktop_01.png"
                alt="Desktop Dashboard Preview"
                fill
                className={styles.showcaseImage}
                sizes="620px"
              />
            </div>
          </div>

          <motion.div
            className={`${styles.deviceWrapper} ${styles.mobileWrapper}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.15, duration: 0.9, ease: 'easeOut' }}
          >
            <div className={styles.mobileFrame}>
              <Image
                src="/landing/project_mobile_01.png"
                alt="Mobile App Preview"
                fill
                className={styles.showcaseImage}
                sizes="260px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
