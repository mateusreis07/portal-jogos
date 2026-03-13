import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FoxChaos - Jogos Grátis',
    short_name: 'FoxChaos',
    description: 'Jogue os melhores jogos em HTML5 gratuitamente no seu navegador ou celular.',
    start_url: '/pt-BR', // Defaulting to the base locale
    display: 'standalone',
    background_color: '#0f172a', // Tailwind slate-900
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
