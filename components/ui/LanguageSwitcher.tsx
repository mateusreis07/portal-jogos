'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      // Very basic manual routing replacement without next-intl's special navigation API
      // Replace the current locale in the path with the new one
      const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);

      router.replace(newPathname || `/${nextLocale}`);
    });
  }

  return (
    <div className="relative inline-flex items-center text-sm md:text-base cursor-pointer">
      <Globe className="w-4 h-4 mr-2 text-zinc-400 group-hover:text-amber-400 transition-colors" />
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
        className="appearance-none bg-transparent py-1 pr-6 pl-2 text-zinc-300 hover:text-white cursor-pointer transition-colors focus:ring-0 focus:outline-none border-none ring-0 [&>option]:bg-zinc-900 [&>option]:text-zinc-300"
      >
        <option value="en">English (US)</option>
        <option value="pt-BR">Português (BR)</option>
        <option value="es">Español</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
