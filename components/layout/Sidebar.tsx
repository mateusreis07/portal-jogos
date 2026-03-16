'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Home,
  Heart,
  Gamepad2,
  Puzzle,
  CarFront,
  Crosshair,
  Map as MapIcon,
  Trophy,
  BrainCircuit,
  Users
} from 'lucide-react';

export default function Sidebar() {
  const tNav = useTranslations('Navigation');
  const tCat = useTranslations('Categories');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((prev) => {
        // Ensure same hysteresis deadzone as Navbar to stay synced
        if (!prev && window.scrollY > 80) return true;
        if (prev && window.scrollY < 20) return false;
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to determine if a path is active
  const isActive = (path: string) => {
    // Next-intl prefixes paths with locale, e.g., /pt-BR/category/arcade
    if (path === '/') return pathname === '/' || pathname.match(/^\/[a-z]{2}(-[A-Z]{2})?$/);
    return pathname.includes(path);
  };

  const menuItems = [
    {
      title: tNav('home'),
      icon: <Home className="h-6 w-6" />,
      href: '/',
      exact: true
    },
    {
      title: tNav('dashboard'),
      icon: <Heart className="h-6 w-6" />,
      href: '/dashboard'
    },
    { divider: true },
    {
      title: tCat('arcade'),
      icon: <Gamepad2 className="h-6 w-6" />,
      href: '/category/arcade'
    },
    {
      title: tCat('puzzle'),
      icon: <Puzzle className="h-6 w-6" />,
      href: '/category/puzzle'
    },
    {
      title: tCat('racing'),
      icon: <CarFront className="h-6 w-6" />,
      href: '/category/racing'
    },
    {
      title: tCat('shooting'),
      icon: <Crosshair className="h-6 w-6" />,
      href: '/category/shooting'
    },
    {
      title: tCat('adventure'),
      icon: <MapIcon className="h-6 w-6" />,
      href: '/category/adventure'
    },
    {
      title: tCat('sports'),
      icon: <Trophy className="h-6 w-6" />,
      href: '/category/sports'
    },
    {
      title: tCat('strategy'),
      icon: <BrainCircuit className="h-6 w-6" />,
      href: '/category/strategy'
    },
    {
      title: tCat('multiplayer'),
      icon: <Users className="h-6 w-6" />,
      href: '/category/multiplayer'
    }
  ];

  return (
    <aside className={`fixed left-0 bottom-0 z-40 hidden md:flex flex-col bg-[#0b0c18] border-r border-white/5 w-16 hover:w-64 transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto group ${
      isScrolled ? 'top-16' : 'top-24'
    }`}>
      <div className="flex flex-col py-4 w-64">
        {menuItems.map((item, index) => {
          if (item.divider) {
            return <div key={`divider-${index}`} className="my-2 border-t border-slate-900 w-full" />;
          }

          if (!item.href || !item.title) return null;

          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center h-12 px-5 transition-colors ${active
                ? 'bg-primary/5 text-primary border-r-4 border-primary shadow-[inset_-5px_0_15px_-5px_rgba(255,90,0,0.2)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              title={item.title} // For tooltip when collapsed
            >
              <div className="flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="ml-4 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
