'use client';

import { useLocale } from 'next-intl';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = "Search games..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const locale = useLocale();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-slate-200 placeholder:text-slate-500"
        />
      </div>
    </form>
  );
}
