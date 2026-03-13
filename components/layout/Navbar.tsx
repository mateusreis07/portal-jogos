'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  Menu, X,
  Home, Heart,
  Gamepad2, Puzzle, CarFront, Crosshair,
  Map as MapIcon, Trophy, BrainCircuit, Users
} from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const tCat = useTranslations('Categories');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname.includes(path);

  const menuItems = [
    { title: t('home'), icon: <Home className="h-5 w-5" />, href: '/', exact: true },
    { title: t('dashboard'), icon: <Heart className="h-5 w-5" />, href: '/dashboard' },
    { divider: true },
    { title: tCat('arcade'), icon: <Gamepad2 className="h-5 w-5" />, href: '/category/arcade' },
    { title: tCat('puzzle'), icon: <Puzzle className="h-5 w-5" />, href: '/category/puzzle' },
    { title: tCat('racing'), icon: <CarFront className="h-5 w-5" />, href: '/category/racing' },
    { title: tCat('shooting'), icon: <Crosshair className="h-5 w-5" />, href: '/category/shooting' },
    { title: tCat('adventure'), icon: <MapIcon className="h-5 w-5" />, href: '/category/adventure' },
    { title: tCat('sports'), icon: <Trophy className="h-5 w-5" />, href: '/category/sports' },
    { title: tCat('strategy'), icon: <BrainCircuit className="h-5 w-5" />, href: '/category/strategy' },
    { title: tCat('multiplayer'), icon: <Users className="h-5 w-5" />, href: '/category/multiplayer' },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-slate-800 backdrop-blur-xl ${isScrolled ? 'h-16 bg-slate-900/95 shadow-xl' : 'h-24 bg-slate-900/80'
        }`}>
        <div className="max-w-[1600px] mx-auto px-4 h-full">
          <div className="flex h-full items-center justify-between gap-4">
            <div className="flex items-center h-full overflow-visible">
              {/* Hamburger — mobile only */}
              <button
                className="md:hidden p-2 mr-2 text-slate-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-8 w-8" />
              </button>

              <Link href="/" className="flex items-center h-full relative group overflow-visible">
                {/* Branding Container */}
                <div className="flex items-center h-full transition-all duration-500 overflow-visible">
                  {/* Mascot - Resized to fit the header */}
                  <div className={`transition-all duration-500 ease-in-out flex items-center justify-center overflow-visible ${isScrolled
                      ? 'w-0 opacity-0 scale-50 -translate-x-10 pointer-events-none'
                      : 'w-24 sm:w-28 md:w-32 opacity-100 scale-100 translate-x-0'
                    }`}>
                    <Image
                      src="/images/brand/logo-mascot.png"
                      alt="FoxChaos Mascot"
                      width={120}
                      height={120}
                      className="w-auto h-20 md:h-24 object-contain group-hover:rotate-3 transition-transform"
                      priority
                      quality={100}
                    />
                  </div>

                  {/* Text Logo - Resized to fit the header */}
                  <div className={`transition-all duration-500 ease-in-out flex items-center h-full ${isScrolled ? 'ml-6 sm:ml-8 md:ml-10' : '-ml-4 sm:-ml-6 md:-ml-8'
                    }`}>
                    <Image
                      src="/images/brand/logo-text.png"
                      alt="FoxChaos"
                      width={200}
                      height={60}
                      className={`w-auto transition-all duration-300 ${isScrolled ? 'h-10 sm:h-11 md:h-12' : 'h-14 sm:h-16 md:h-18'
                        }`}
                      priority
                      quality={100}
                    />
                  </div>
                </div>
              </Link>
            </div>

            {/* SearchBar Area */}
            <div className="flex-1 flex justify-end items-center max-w-lg">
              <div className="w-full">
                <SearchBar placeholder={t('search_placeholder')} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[70] w-80 bg-slate-950 border-r border-slate-800 transform transition-transform duration-500 md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Drawer Header */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-4 border-b border-slate-800 bg-slate-900">
          <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src="/images/brand/logo-full.png"
              alt="FoxChaos Logo"
              width={200}
              height={80}
              className="h-20 w-auto"
              quality={100}
              priority
            />
          </Link>
          <button
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        {/* Drawer Items */}
        <div className="flex flex-col py-6 overflow-y-auto h-[calc(100vh-10rem)] bg-slate-950">
          {menuItems.map((item, index) => {
            if (item.divider) {
              return <div key={`divider-${index}`} className="my-4 border-t border-slate-800/50 mx-8" />;
            }
            if (!item.href || !item.title) return null;

            const active = item.exact ? pathname.endsWith(item.href) : isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 h-14 px-8 transition-all duration-300 ${active
                    ? 'bg-primary/10 text-primary border-r-4 border-primary'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
              >
                <div className={`${active ? 'text-primary' : 'text-slate-500'} transition-colors`}>
                  {item.icon}
                </div>
                <span className={`font-bold tracking-tight text-lg ${active ? 'text-white' : ''}`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
