import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Arcade Hub - Play HTML5 Games Online Free',
    template: '%s | Arcade Hub',
  },
  description: 'The best portal to play free online HTML5 games in your browser. Action, Puzzle, Arcade and more.',
  keywords: ['games', 'html5', 'browser games', 'free games', 'online games', 'arcade', 'puzzle'],
  openGraph: {
    title: 'Arcade Hub - Play Online Free',
    description: 'The best portal to play free online HTML5 games',
    url: 'https://arcadehub.example.com',
    siteName: 'Arcade Hub',
    locale: 'en_US',
    type: 'website',
  },
  appleWebApp: {
    title: 'Arcade Hub',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/icon-512x512.png',
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
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased bg-slate-950 text-slate-200`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <div className="flex w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] w-full md:pl-16 transition-all duration-300">
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
