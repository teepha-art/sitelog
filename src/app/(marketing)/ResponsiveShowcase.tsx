'use client';

import { motion } from 'framer-motion';
import styles from './ResponsiveShowcase.module.css';

function DesktopPlaceholder() {
  return (
    <div className={styles.placeholderDesktop}>
      <div className={styles.placeholderTopbar}>
        <div className={styles.placeholderLogo} />
        <div className={styles.placeholderSearch} />
        <div className={styles.placeholderAvatar} />
      </div>
      <div className={styles.placeholderKpiRow}>
        <div className={styles.placeholderKpi} />
        <div className={styles.placeholderKpi} />
        <div className={styles.placeholderKpi} />
        <div className={styles.placeholderKpi} />
        <div className={styles.placeholderKpi} />
      </div>
      <div className={styles.placeholderTable}>
        <div className={styles.placeholderTableHeader} />
        <div className={styles.placeholderTableRow} />
        <div className={styles.placeholderTableRow} />
        <div className={styles.placeholderTableRow} />
        <div className={styles.placeholderTableRow} />
      </div>
    </div>
  );
}

function TabletPlaceholder() {
  return (
    <div className={styles.placeholderTablet}>
      <div className={styles.placeholderNav}>
        <div className={styles.placeholderBack} />
        <div className={styles.placeholderTitle} />
      </div>
      <div className={styles.placeholderList}>
        <div className={styles.placeholderListItem}>
          <div className={styles.placeholderListDot} />
          <div className={styles.placeholderListLineLong} />
        </div>
        <div className={styles.placeholderListItem}>
          <div className={styles.placeholderListDot} />
          <div className={styles.placeholderListLineLong} />
        </div>
        <div className={styles.placeholderListItem}>
          <div className={styles.placeholderListDot} />
          <div className={styles.placeholderListLineShort} />
        </div>
        <div className={styles.placeholderListItem}>
          <div className={styles.placeholderListDot} />
          <div className={styles.placeholderListLineLong} />
        </div>
      </div>
    </div>
  );
}

function MobilePlaceholder() {
  return (
    <div className={styles.placeholderMobile}>
      <div className={styles.placeholderMobileHeader}>
        <div className={styles.placeholderBack} />
        <div className={styles.placeholderTitleSmall} />
        <div className={styles.placeholderBack} />
      </div>
      <div className={styles.placeholderCardRow}>
        <div className={styles.placeholderCard}>
          <div className={styles.placeholderCardBar} />
          <div className={styles.placeholderCardBarShort} />
        </div>
        <div className={styles.placeholderCard}>
          <div className={styles.placeholderCardBarWarning} />
          <div className={styles.placeholderCardBarShort} />
        </div>
        <div className={styles.placeholderCard}>
          <div className={styles.placeholderCardBarCritical} />
          <div className={styles.placeholderCardBarShort} />
        </div>
      </div>
    </div>
  );
}

export function ResponsiveShowcase() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Your projects, on every screen</h2>
        <p className={styles.subtitle}>
          Report from the field, monitor from anywhere — on any device.
        </p>

        <motion.div
          className={styles.cluster}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div
            className={`${styles.deviceWrapper} ${styles.tabletWrapper}`}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.75, duration: 0.9, ease: 'easeOut' },
              },
            }}
          >
            <div className={`${styles.deviceFrame} ${styles.tabletFrame}`}>
              <div className={styles.screenContainer}>
                <TabletPlaceholder />
              </div>
            </div>
            <span className={styles.deviceLabel}>Tablet</span>
          </motion.div>

          <div className={`${styles.deviceWrapper} ${styles.desktopWrapper}`}>
            <div className={`${styles.deviceFrame} ${styles.desktopFrame}`}>
              <div className={styles.screenContainer}>
                <DesktopPlaceholder />
              </div>
            </div>
            <span className={styles.deviceLabel}>Desktop</span>
          </div>

          <motion.div
            className={`${styles.deviceWrapper} ${styles.mobileWrapper}`}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.15, duration: 0.9, ease: 'easeOut' },
              },
            }}
          >
            <div className={`${styles.deviceFrame} ${styles.mobileFrame}`}>
              <div className={styles.mobileNotch} />
              <div className={styles.screenContainer}>
                <MobilePlaceholder />
              </div>
            </div>
            <span className={styles.deviceLabel}>Mobile</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
