import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'FoxChaos - Play HTML5 Games Online Free',
    template: '%s | FoxChaos',
  },
  description: 'The best portal to play free online HTML5 games in your browser. Action, Puzzle, Arcade and more.',
  keywords: ['games', 'html5', 'browser games', 'free games', 'online games', 'arcade', 'puzzle'],
  openGraph: {
    title: 'FoxChaos - Play Online Free',
    description: 'The best portal to play free online HTML5 games',
    url: 'https://foxchaos.com',
    siteName: 'FoxChaos',
    locale: 'en_US',
    type: 'website',
  },
  appleWebApp: {
    title: 'FoxChaos',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/icon-512x512.png',
    ],
  },
  icons: {
    icon: [
      { url: '/images/brand/logo-mascot.png', type: 'image/png' },
    ],
    apple: [
      { url: '/images/brand/logo-mascot.png', type: 'image/png' },
    ],
  },
};

export const viewport = {
  themeColor: '#0f172a',
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  // ... (in the render function)
  return (
    <html lang={locale} className="dark">
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3311983697432850"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased bg-slate-950 text-slate-200`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <div className="flex w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-[calc(100vh-7rem)] w-full md:pl-16 transition-all duration-300">
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
