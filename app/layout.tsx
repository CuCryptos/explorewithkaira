import type { Metadata } from 'next';
import Script from 'next/script';
import { Playfair_Display, Inter } from 'next/font/google';
import { brandConfig, temperament, gaMeasurementId } from '@/lib/brand';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: { default: `${brandConfig.siteName} | ${brandConfig.tagline}`, template: brandConfig.seoDefaults.titleTemplate },
  description: brandConfig.seoDefaults.metaDescription,
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
