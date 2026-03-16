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
    default: 'JOGOS ONLINE - Jogue Grátis Online em FoxChaos!',
    template: '%s | FoxChaos',
  },
  description: 'O FoxChaos é o seu portal definitivo para os melhores jogos online grátis. Oferecemos centenas de títulos divertidos para você jogar sozinho ou com amigos, sem necessidade de download.',
  keywords: ['jogos online', 'jogos grátis', 'jogar online', 'jogos html5', 'games', 'browser games', 'free games', 'arcade', 'puzzle'],
  openGraph: {
    title: 'JOGOS ONLINE - Jogue Grátis Online em FoxChaos!',
    description: 'O FoxChaos é o seu portal definitivo para os melhores jogos online grátis. Jogue agora sem download!',
    url: 'https://foxchaos.com',
    siteName: 'FoxChaos',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/images/brand/logo-full.png',
        width: 1200,
        height: 630,
        alt: 'FoxChaos - Portal de Jogos Online Grátis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JOGOS ONLINE - Jogue Grátis Online em FoxChaos!',
    description: 'O FoxChaos é o seu portal definitivo para os melhores jogos online grátis.',
    images: ['/images/brand/logo-full.png'],
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
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
  },
  metadataBase: new URL('https://foxchaos.com'),
};

export const viewport = {
  themeColor: '#08090f',
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
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased`}>
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
