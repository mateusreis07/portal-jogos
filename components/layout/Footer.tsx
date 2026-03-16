import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Footer() {
  const t = useTranslations('Footer');
  const cat = useTranslations('Categories');
  const nav = useTranslations('Navigation');

  return (
    <footer className="bg-transparent border-t border-white/5 pt-16 pb-8 mt-20 relative overflow-hidden">
      {/* Background glow for footer */}
      <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8 group inline-block">
              <Image 
                src="/images/brand/logo-text.png" 
                alt="FoxChaos Logo" 
                width={200} 
                height={60} 
                className="h-14 w-auto group-hover:scale-105 transition-transform duration-500"
                quality={100}
              />
            </Link>
            <p className="text-slate-400 max-w-sm text-base leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 tracking-widest uppercase text-xs opacity-50">{nav('popular')}</h3>
            <ul className="space-y-4">
              <li><Link href="/category/arcade" className="text-slate-400 hover:text-primary transition-all text-sm hover:pl-2">{cat('arcade')}</Link></li>
              <li><Link href="/category/puzzle" className="text-slate-400 hover:text-primary transition-all text-sm hover:pl-2">{cat('puzzle')}</Link></li>
              <li><Link href="/category/racing" className="text-slate-400 hover:text-primary transition-all text-sm hover:pl-2">{cat('racing')}</Link></li>
              <li><Link href="/category/shooting" className="text-slate-400 hover:text-primary transition-all text-sm hover:pl-2">{cat('shooting')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 tracking-widest uppercase text-xs opacity-50">{t('legal')}</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-slate-400 hover:text-primary transition-all text-sm hover:pl-2">{nav('about')}</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-primary transition-all text-sm hover:pl-2">{nav('contact')}</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-primary transition-all text-sm hover:pl-2">{t('privacy')}</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-primary transition-all text-sm hover:pl-2">{t('terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} <span className="text-slate-300 font-bold">FoxChaos</span>. {t('rights')}.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <LanguageSwitcher />
            <p className="text-slate-600 text-xs font-medium tracking-tight">
              {t('developed_by')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
