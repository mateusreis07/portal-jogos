import Link from 'next/link';
import SearchBar from '@/components/ui/SearchBar';
import { Gamepad2, Menu } from 'lucide-react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const cat = useTranslations('Categories');

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight">Arcade<span className="text-primary">Hub</span></span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/popular" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t('popular')}</Link>
              <Link href="/new" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t('new')}</Link>
              <div className="h-4 w-px bg-slate-700"></div>
              <Link href="/category/arcade" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{cat('arcade')}</Link>
              <Link href="/category/puzzle" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{cat('puzzle')}</Link>
              <Link href="/category/racing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{cat('racing')}</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="hidden sm:block w-64">
              <SearchBar placeholder={t('search_placeholder')} />
            </div>
            <button className="md:hidden p-2 text-slate-400 hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
