import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export default function Footer() {
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
              The ultimate destination for free online HTML5 browser games. Play instantly with no downloads required.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-100 mb-4 tracking-wider uppercase text-sm">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/category/arcade" className="text-slate-400 hover:text-primary transition-colors text-sm">Arcade Games</Link></li>
              <li><Link href="/category/puzzle" className="text-slate-400 hover:text-primary transition-colors text-sm">Puzzle Games</Link></li>
              <li><Link href="/category/racing" className="text-slate-400 hover:text-primary transition-colors text-sm">Racing Games</Link></li>
              <li><Link href="/category/shooting" className="text-slate-400 hover:text-primary transition-colors text-sm">Shooting Games</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-100 mb-4 tracking-wider uppercase text-sm">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-400 hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-primary transition-colors text-sm">Contact</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center md:flex md:justify-between md:text-left">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} ArcadeHub. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-slate-600 text-xs">
              All games are copyrighted or trademarked by their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
