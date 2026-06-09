import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { PricingSection } from './PricingSection';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.container}>
        <div className={styles.header}>
          <a href="#hero" className={styles.headerLogoLink}>
            <Image src="/logo/sitelog_wordmark_color.svg" alt="SiteLog" width={0} height={0} className={styles.headerLogo} priority />
          </a>
          <div className={styles.headerActions}>
            <Link href="/auth?mode=login" className={styles.loginLink}>Log In</Link>
            <Link href="/auth?mode=signup" tabIndex={-1}>
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className={`${styles.container} ${styles.hero}`}>
        <h1 className={styles.heroTitle}>
          Every site at a glance. No phone calls required.
        </h1>
        <p className={styles.heroSubtitle}>
          SiteLog gives construction project managers real-time visibility across all sites while keeping supervisor reporting under three minutes.
        </p>
        <Link href="/auth?mode=signup" tabIndex={-1}>
          <Button size="lg">Get Started</Button>
        </Link>

        <div className={styles.heroVisual}>
          {/* Placeholder for Dashboard Mockup */}
          <div style={{ color: 'var(--color-on-surface-variant)' }}>Dashboard Preview</div>
        </div>
      </section>

      {/* Problem Section */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Built to stop the chaos</h2>
            <p className={styles.sectionSubtitle}>WhatsApp wasn't made for managing construction sites.</p>
          </div>
          <div className={styles.grid3}>
            <div className={styles.problemCard}>
              <h3 className={styles.problemTitle}>Issues reported too late</h3>
              <p>By the time you hear about a delay, it's already cost you money. SiteLog gets issues to you instantly.</p>
            </div>
            <div className={styles.problemCard}>
              <h3 className={styles.problemTitle}>Material requests lost</h3>
              <p>Stop scrolling through chat history to figure out what materials your team needs and when.</p>
            </div>
            <div className={styles.problemCard}>
              <h3 className={styles.problemTitle}>No permanent record</h3>
              <p>Keep a structured, searchable history of every report, issue, and request for compliance and disputes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.featureRow}>
            <div className={styles.featureContent}>
              <h2 className={styles.featureTitle}>Daily Reporting in under 3 minutes</h2>
              <p className={styles.featureDesc}>
                Site supervisors don't have time for complex forms. SiteLog's reporting is mobile-first, fast, and auto-saves progress even if the connection drops.
              </p>
            </div>
            <div className={styles.featureVisual}>
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-on-surface-variant)' }}>
                Mobile Report Mockup
              </div>
            </div>
          </div>

          <div className={styles.featureRow}>
            <div className={styles.featureContent}>
              <h2 className={styles.featureTitle}>Track issues to resolution</h2>
              <p className={styles.featureDesc}>
                Log an issue from the site with priority and photos. Project managers can assign it to a team member and track its status from open to resolved.
              </p>
            </div>
            <div className={styles.featureVisual}>
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-on-surface-variant)' }}>
                Issue Tracker Mockup
              </div>
            </div>
          </div>

          <div className={styles.featureRow}>
            <div className={styles.featureContent}>
              <h2 className={styles.featureTitle}>Structured material requests</h2>
              <p className={styles.featureDesc}>
                Supervisors request materials with specific urgency levels. Project managers review, approve, and track fulfilment all in one place.
              </p>
            </div>
            <div className={styles.featureVisual}>
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-on-surface-variant)' }}>
                Material Requests Mockup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Built for the field */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container} style={{ textAlign: 'center' }}>
          <h2 className={styles.sectionTitle}>Built for the field</h2>
          <p className={styles.sectionSubtitle} style={{ marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Works on any phone. No app installation required. High contrast for outdoor readability. Forms survive dropped connections.
          </p>
          <Link href="/auth?mode=signup" tabIndex={-1}>
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerContent}`}>
          <a href="#hero" className={styles.footerLogoLink}>
            <Image src="/logo/sitelog_wordmark_color.svg" alt="SiteLog" width={0} height={0} className={styles.footerLogo} priority />
          </a>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} SiteLog. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
