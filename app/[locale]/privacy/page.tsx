import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - FoxChaos',
  description: 'FoxChaos Privacy Policy',
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isPt = locale === 'pt-BR';

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 sm:px-12 bg-slate-900 border border-slate-800 rounded-2xl mt-8 mb-16 shadow-xl">
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
        <p>{isPt ? 'Utilizamos serviços de publicidade de terceiros (como Google AdSense) que podem utilizar cookies para veicular anúncios baseados em visitas anteriores suas ao nosso site ou a outros sites na Internet.' : 'We use third-party advertising services (like Google AdSense) that may use cookies to serve ads based on your previous visits to our website or other websites on the Internet.'}</p>
        
        <p className="mt-8 pt-8 border-t border-slate-800 text-sm">
          {isPt ? 'Para dúvidas, entre em contato em support@foxchaos.com' : 'For questions, please contact support@foxchaos.com'}
        </p>
      </div>
    </div>
  );
}
