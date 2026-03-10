import createMiddleware from 'next-intl/middleware';
import { defineRouting } from 'next-intl/routing';

const routing = defineRouting({
  locales: ['en', 'pt-BR', 'es'],
  defaultLocale: 'pt-BR',
  localePrefix: 'always'
});

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(pt-BR|en|es)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
