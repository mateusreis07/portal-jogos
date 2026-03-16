import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JOGOS ONLINE - Jogue Grátis Online em FoxChaos!',
    short_name: 'FoxChaos',
    description: 'Jogue os melhores jogos em HTML5 gratuitamente no seu navegador ou celular.',
    start_url: '/pt-BR', // Defaulting to the base locale
    display: 'standalone',
    background_color: '#08090f',
    theme_color: '#08090f',
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
