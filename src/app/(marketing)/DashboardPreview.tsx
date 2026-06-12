import React from 'react';
import styles from './DashboardPreview.module.css';

function DashboardPlaceholder() {
  return (
    <div className={styles.placeholderPanel}>
      <div className={styles.placeholderTopbar}>
        <div className={styles.placeholderTopbarTitle} />
        <div className={styles.placeholderTopbarActions}>
          <div className={styles.placeholderDot} />
          <div className={styles.placeholderDot} />
        </div>
      </div>
      <div className={styles.placeholderKpiRow}>
        <div className={styles.placeholderKpi}>
          <div className={styles.placeholderKpiLabel} />
          <div className={styles.placeholderKpiValue} />
        </div>
        <div className={`${styles.placeholderKpi} ${styles.placeholderKpiActive}`}>
          <div className={styles.placeholderKpiLabel} />
          <div className={styles.placeholderKpiValue} />
        </div>
        <div className={styles.placeholderKpi}>
          <div className={styles.placeholderKpiLabel} />
          <div className={styles.placeholderKpiValue} />
        </div>
      </div>
      <div className={styles.placeholderList}>
        <div className={styles.placeholderListItem}>
          <div className={styles.placeholderListDot} />
          <div className={styles.placeholderListText}>
            <div className={styles.placeholderLine} />
            <div className={`${styles.placeholderLine} ${styles.placeholderLineShort}`} />
          </div>
        </div>
        <div className={styles.placeholderListItem}>
          <div className={styles.placeholderListDot} />
          <div className={styles.placeholderListText}>
            <div className={styles.placeholderLine} />
            <div className={`${styles.placeholderLine} ${styles.placeholderLineShort}`} />
          </div>
        </div>
        <div className={styles.placeholderListItem}>
          <div className={styles.placeholderListDot} />
          <div className={styles.placeholderListText}>
            <div className={styles.placeholderLine} />
            <div className={`${styles.placeholderLine} ${styles.placeholderLineShort}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

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
                <p className={styles.cardDesc}>Monitor all your projects from a single dashboard. See KPIs, track issues, and review reports — all in one place.</p>
              </div>
              <div className={styles.cardVisual}>
                <DashboardPlaceholder />
              </div>
            </div>
          </div>

          {/* Top Layer: Card 2 */}
          <div className={styles.cardItem} style={{ zIndex: 3 }}>
            <div className={styles.cardInner}>
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>Site Supervisor</h3>
                <p className={styles.cardDesc}>Submit daily reports, log issues, and request materials from your phone. Takes under three minutes on site.</p>
              </div>
              <div className={styles.cardVisual}>
                <DashboardPlaceholder />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
