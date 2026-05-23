import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Tajawal } from 'next/font/google';
import './globals.css';
import { JsonLdOrganization } from '@/components/brand/JsonLd';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { UpsellModal } from '@/components/checkout/UpsellModal';
import { ToastProvider } from '@/components/ui/Toast';
import { PixelLoader } from '@/components/providers/PixelLoader';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-tajawal',
  display: 'swap',
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: false,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'رحيق Raheeq Arabia — حلوى يومية تليق بكِ',
    template: '%s · رحيق',
  },
  description:
    'حبّة جذر، حبّة ليالي، حبّة نورة — مكمّلات بطعم حلوى، بمكوّنات عالمية، ودفع عند الاستلام داخل المملكة.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://raheeqarabia.com',
  ),
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'رحيق Raheeq Arabia',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'theme-color': '#0E4F3A',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <head>
        <meta name="theme-color" content="#0E4F3A" />
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <JsonLdOrganization />
      </head>
      <body className="bg-[var(--bg-cream)] text-[var(--ink)] font-tajawal antialiased">
        <PixelLoader />
        <AnnouncementBar />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <CartDrawer />
        <CheckoutModal />
        <UpsellModal />
        <CookieBanner />
        <ToastProvider />
      </body>
    </html>
  );
}
