import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
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

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
