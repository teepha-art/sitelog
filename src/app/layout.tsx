import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const siteUrl = 'https://sitelog-sage.vercel.app';
const ogImage = '/open-graphic/og.png';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'SiteLog — Construction Site Reporting & Issue Tracking',
  description:
    'SiteLog gives construction project managers real-time visibility across all sites while keeping supervisor reporting under three minutes.',
  icons: {
    icon: '/logo/sitelog_favicon.svg',
    apple: '/logo/sitelog_favicon.svg',
  },
  openGraph: {
    title: 'SiteLog',
    description:
      'B2B site reporting for construction teams — reports, issues, and materials from the field to the office.',
    url: siteUrl,
    siteName: 'SiteLog',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SiteLog',
    description:
      'B2B site reporting for construction teams — reports, issues, and materials from the field to the office.',
    images: [ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
