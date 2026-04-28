import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - FoxChaos',
  description: 'FoxChaos Privacy Policy',
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isPt = locale === 'pt-BR';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoxChaos', item: `https://foxchaos.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: isPt ? 'Privacidade' : 'Privacy', item: `https://foxchaos.com/${locale}/privacy` },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 sm:px-12 bg-slate-900 border border-slate-800 rounded-2xl mt-8 mb-16 shadow-xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <h1 className="text-3xl font-bold text-white mb-6">
        {isPt ? 'Política de Privacidade' : 'Privacy Policy'}
      </h1>
      
      <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
        <p><strong>{isPt ? 'Última atualização:' : 'Last updated:'}</strong> {new Date().toLocaleDateString(isPt ? 'pt-BR' : 'en-US')}</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">{isPt ? '1. Informações que coletamos' : '1. Information We Collect'}</h2>
        <p>{isPt ? 'Coletamos informações básicas de navegação para melhorar sua experiência. Não exigimos cadastro obrigatório para jogar a maioria dos nossos jogos.' : 'We collect basic navigation information to improve your experience. We do not require mandatory registration to play most of our games.'}</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">{isPt ? '2. Como usamos os dados' : '2. How We Use Data'}</h2>
        <p>{isPt ? 'Os dados coletados (como cookies, endereços de IP anônimos e logs de acesso) são utilizados exclusivamente para manter o site seguro, analisar o tráfego para melhorar o portal e exibir anúncios relevantes de parceiros selecionados.' : 'The collected data (such as cookies, anonymous IP addresses, and access logs) are used exclusively to keep the site secure, analyze traffic to improve the portal, and display relevant ads from selected partners.'}</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">{isPt ? '3. Compartilhamento' : '3. Sharing'}</h2>
        <p>{isPt ? 'Não vendemos nem compartilhamos seus dados pessoais com terceiros não afiliados, exceto quando necessário para fornecer o serviço (ex: provedores de hospedagem) ou por exigência legal.' : 'We do not sell or share your personal data with unaffiliated third parties, except when necessary to provide the service (e.g., hosting providers) or required by law.'}</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">{isPt ? '4. Seus Direitos' : '4. Your Rights'}</h2>
        <p>{isPt ? 'Você tem o direito de solicitar a exclusão de qualquer dado que possamos ter associado a você, solicitar limitações de processamento ou tirar dúvidas, bastando entrar em contato com nossa equipe.' : 'You have the right to request the deletion of any data we may have associated with you, request processing limitations, or ask questions simply by contacting our team.'}</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">{isPt ? '5. Cookies de Terceiros e Anúncios' : '5. Third-party Cookies and Ads'}</h2>
        <p>
          {isPt 
            ? 'Utilizamos serviços de publicidade de terceiros (como Google AdSense) para veicular anúncios quando você visita nosso site. Essas empresas podem usar cookies para veicular anúncios baseados em suas visitas anteriores a este ou a outros sites.' 
            : 'We use third-party advertising companies (like Google AdSense) to serve ads when you visit our website. These companies may use cookies to serve ads based on your prior visits to this or other websites.'}
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            {isPt 
              ? 'O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios no seu site.' 
              : 'Google, as a third-party vendor, uses cookies to serve ads on your site.'}
          </li>
          <li>
            {isPt 
              ? 'Com o uso do cookie DoubleClick, o Google e os parceiros dele podem exibir anúncios para os usuários com base nas visitas feitas aos seus sites e/ou a outros sites na Internet.' 
              : 'Google\'s use of the DoubleClick cookie enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.'}
          </li>
          <li>
            {isPt 
              ? 'Você pode desativar o uso do cookie DoubleClick para publicidade baseada em interesses acessando as Configurações de anúncios do Google.' 
              : 'You may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting Google Ad Settings.'}
          </li>
        </ul>
        <p>
          {isPt 
            ? 'Alternativamente, você pode orientar os usuários a desativar o uso de cookies de terceiros para publicidade baseada em interesses acessando o site aboutads.info.' 
            : 'Alternatively, you can direct users to opt out of a third-party vendor\'s use of cookies for interest-based advertising by visiting aboutads.info.'}
        </p>
        
        <h2 className="text-xl font-semibold text-white mt-8">{isPt ? '6. Links de Terceiros' : '6. Third-party Links'}</h2>
        <p>
          {isPt 
            ? 'Nosso site contém links para outros sites (como os próprios jogos). Não somos responsáveis pelas práticas de privacidade ou pelo conteúdo desses sites externos.' 
            : 'Our site contains links to other websites (such as the games themselves). We are not responsible for the privacy practices or content of these external sites.'}
        </p>

        <p className="mt-8 pt-8 border-t border-slate-800 text-sm">
          {isPt ? 'Para dúvidas, entre em contato em support@foxchaos.com' : 'For questions, please contact support@foxchaos.com'}
        </p>
      </div>
    </div>
  );
}
