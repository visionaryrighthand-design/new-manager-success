import type { Metadata, Viewport } from 'next';
import { brand } from '@nms/brand';
import './globals.css';

/**
 * Root layout: document shell only.
 *
 * Site chrome lives in `(site)/layout.tsx` and the feed player deliberately
 * has none — see `(player)`. Once a learner is inside a Section, chrome that
 * offers them somewhere else to go is working against the product.
 */

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: brand.tagline }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0C12' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
