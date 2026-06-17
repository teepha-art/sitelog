import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { PricingSection } from './PricingSection';
import { DashboardPreview } from './DashboardPreview';
import { DotGrid } from './DotGrid';
import { ProblemSection } from './ProblemSection';
import { ResponsiveShowcase } from './ResponsiveShowcase';
import { CtaSection } from './CtaSection';
import { ClosingCta } from './ClosingCta';
import { MobileNav } from './MobileNav';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.headerOuter}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <a href="#hero" className={styles.headerLogoLink}>
              <Image src="/logo/sitelog_wordmark_color.svg" alt="SiteLog" width={0} height={0} className={styles.headerLogo} priority />
            </a>
          </div>

          <nav className={styles.headerNav}>
            <a href="#pricing" className={styles.navLink}>Pricing</a>
          </nav>
          <div className={styles.headerActions}>
            <Link href="/auth?mode=login" className={styles.loginLink}>Log In</Link>
            <Link href="/auth?mode=signup" tabIndex={-1}>
              <Button>Get Started</Button>
            </Link>
          </div>
          <div className={styles.mobileNavWrapper}>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroBg}>
          <DotGrid />
        </div>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>
              <span className={`${styles.heroTitleDark} ${styles.heroFirstLine}`}>Every site at a glance.</span>
              <span className={styles.heroTitleDark}>No phone </span><span className={styles.heroTitlePrimary}>calls required.</span>
            </h1>
            <Link href="/auth?mode=signup" tabIndex={-1} className={styles.heroCta}>
              <Button size="lg">
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      {/* Dashboard Preview Section */}
      <DashboardPreview />

      {/* Problem Section */}
      <ProblemSection />

      {/* Responsive Showcase Section */}
      <ResponsiveShowcase />

      {/* Pricing Section */}
      <PricingSection />

      {/* Closing CTA Section */}
      <ClosingCta />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <a href="#hero" className={styles.footerLogoLink}>
              <Image src="/logo/sitelog_wordmark_white.svg" alt="SiteLog" width={0} height={0} className={styles.footerLogo} priority />
            </a>

          </div>
          <nav className={styles.footerLinks}>
            <a href="#pricing" className={styles.footerLink}>Pricing</a>
            <Link href="/auth" className={styles.footerLink}>Log In</Link>
            <Link href="/auth?mode=signup" className={styles.footerLink}>Get Started</Link>
          </nav>
        </div>
        <div className={styles.footerDivider} />
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} SiteLog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
