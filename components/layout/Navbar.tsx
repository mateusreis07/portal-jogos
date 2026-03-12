'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';
import { useTranslations } from 'next-intl';
import {
  Gamepad2, Menu, X,
  Home, Heart,
  Puzzle, CarFront, Crosshair,
  Map as MapIcon, Trophy, BrainCircuit, Users
} from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const tCat = useTranslations('Categories');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger — mobile only, LEFT side */}
              <button
                className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                  <Gamepad2 className="h-6 w-6 text-primary" />
                </div>
                <span className="font-bold text-xl tracking-tight">Arcade<span className="text-primary">Hub</span></span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block w-64">
                <SearchBar placeholder={t('search_placeholder')} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[70] w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-primary/20 p-2 rounded-lg">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">Arcade<span className="text-primary">Hub</span></span>
          </Link>
          <button
            className="p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Items */}
        <div className="flex flex-col py-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item, index) => {
            if (item.divider) {
              return <div key={`divider-${index}`} className="my-2 border-t border-slate-800 mx-4" />;
            }
            if (!item.href || !item.title) return null;

            const active = item.exact ? pathname.endsWith(item.href) : isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 h-12 px-5 transition-colors ${active
                    ? 'bg-primary/10 text-primary border-r-4 border-primary'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
