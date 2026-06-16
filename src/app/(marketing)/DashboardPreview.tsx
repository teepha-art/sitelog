import React from 'react';
import Image from 'next/image';
import styles from './DashboardPreview.module.css';

export function DashboardPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.cardStack}>

          {/* Bottom Layer: Heading Block */}
          <div className={styles.headerBlock}>
            <h2 className={styles.title}>
              <span style={{ display: 'block' }}>Digitalized</span>
              <span style={{ display: 'block' }}>site control</span>
            </h2>

          </div>

          {/* Middle Layer: Card 1 */}
          <div className={styles.cardItem} style={{ zIndex: 2 }}>
            <div className={styles.cardInner}>
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>Project Manager</h3>
                <p className={styles.cardDesc}>Monitor every project from one dashboard — KPIs, issues, and reports in one place.</p>
              </div>
              <div className={styles.cardVisual}>
                <Image
                  src="/landing/project_dashboard.png"
                  alt="Project Manager Dashboard Preview"
                  fill
                  className={styles.previewImage}
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Top Layer: Card 2 */}
          <div className={styles.cardItem} style={{ zIndex: 3 }}>
            <div className={styles.cardInner}>
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>Site Supervisor</h3>
                <p className={styles.cardDesc}>Submit reports, log issues, and request materials — right from your phone, in minutes.</p>
              </div>
              <div className={styles.cardVisual}>
                <Image
                  src="/landing/site_dashboard.png"
                  alt="Site Supervisor Dashboard Preview"
                  fill
                  className={styles.previewImage}
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
