import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Footer() {
  const t = useTranslations('Footer');
  const cat = useTranslations('Categories');
  const nav = useTranslations('Navigation');

  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">Arcade<span className="text-primary">Hub</span></span>
            </Link>
            <p className="text-slate-400 max-w-sm">
              {t('description')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-100 mb-4 tracking-wider uppercase text-sm">{nav('popular')}</h3>
            <ul className="space-y-3">
              <li><Link href="/category/arcade" className="text-slate-400 hover:text-primary transition-colors text-sm">{cat('arcade')}</Link></li>
              <li><Link href="/category/puzzle" className="text-slate-400 hover:text-primary transition-colors text-sm">{cat('puzzle')}</Link></li>
              <li><Link href="/category/racing" className="text-slate-400 hover:text-primary transition-colors text-sm">{cat('racing')}</Link></li>
              <li><Link href="/category/shooting" className="text-slate-400 hover:text-primary transition-colors text-sm">{cat('shooting')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-100 mb-4 tracking-wider uppercase text-sm">{t('legal')}</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-400 hover:text-primary transition-colors text-sm">{nav('about')}</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-primary transition-colors text-sm">{nav('contact')}</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-primary transition-colors text-sm">{t('privacy')}</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-primary transition-colors text-sm">{t('terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} ArcadeHub. {t('rights')}.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <LanguageSwitcher />
            <p className="text-slate-600 text-xs text-center md:text-left">
              {t('developed_by')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
