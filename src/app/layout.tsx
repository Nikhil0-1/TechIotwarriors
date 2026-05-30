import type { Metadata } from 'next';
import '@/styles/index.css';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Tech IoT Warriors — Learn Arduino, ESP32 & IoT with Real Projects',
  description: 'India\'s premium IoT learning platform. Learn Arduino, ESP32, ESP8266 through real hardware projects, HD video lessons, circuit diagrams, source code, live classes & certifications.',
  keywords: 'Arduino, ESP32, ESP8266, IoT, Electronics, Coding, Circuit Diagrams, Real Projects, IoT Kits, Certificates, Online Learning India',
  authors: [{ name: 'Tech IoT Warriors' }],
  openGraph: {
    title: 'Tech IoT Warriors — Build Real IoT Projects, Not Just Theory',
    description: 'India\'s most premium IoT learning ecosystem with real hardware projects, live classes, IoT kits & certifications.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech IoT Warriors',
    description: 'Learn Arduino, ESP32 & ESP8266 with real projects.',
  },
  robots: { index: true, follow: true },
  viewport: { width: 'device-width', initialScale: 1 },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0B0B0B" />
      </head>
      <body>
        <NavBar />
        <main style={{ paddingTop: 'var(--navbar-h)' }}>
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
