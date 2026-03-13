import type { Metadata } from 'next';
import Script from 'next/script';
import { Playfair_Display, Inter } from 'next/font/google';
import { brandConfig, temperament, gaMeasurementId, baseUrl } from '@/lib/brand';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: `${brandConfig.siteName} | ${brandConfig.tagline}`, template: brandConfig.seoDefaults.titleTemplate },
  description: brandConfig.seoDefaults.metaDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: baseUrl,
    title: `${brandConfig.siteName} | ${brandConfig.tagline}`,
    description: brandConfig.seoDefaults.metaDescription,
    siteName: brandConfig.siteName,
    images: [{ url: brandConfig.seoDefaults.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brandConfig.siteName} | ${brandConfig.tagline}`,
    description: brandConfig.seoDefaults.metaDescription,
    images: [brandConfig.seoDefaults.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-temperament={temperament} className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaMeasurementId}');`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
