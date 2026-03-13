import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - FoxChaos',
  description: 'FoxChaos Terms of Service',
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isPt = locale === 'pt-BR';

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 sm:px-12 bg-slate-900 border border-slate-800 rounded-2xl mt-8 mb-16 shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-6">
        {isPt ? 'Termos de Serviço' : 'Terms of Service'}
      </h1>
      
      <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
        <p><strong>{isPt ? 'Última atualização:' : 'Last updated:'}</strong> {new Date().toLocaleDateString(isPt ? 'pt-BR' : 'en-US')}</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">{isPt ? '1. Aceitação' : '1. Acceptance'}</h2>
        <p>{isPt ? 'Ao acessar e utilizar o portal FoxChaos, você concorda em cumprir estes Termos de Serviço e todas as leis aplicáveis rigorosamente.' : 'By accessing and using the FoxChaos portal, you agree to strictly comply with these Terms of Service and all applicable laws.'}</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">{isPt ? '2. Uso do Serviço' : '2. Use of Service'}</h2>
        <p>{isPt ? 'Nosso portal oferece acesso gratuito a jogos em HTML5 para entretenimento não comercial. É terminantemente proibido tentar burlar nossos sistemas de segurança, extrair ou divulgar partes do site indevidamente, ou utilizar robôs/scripts para sobrecarregar nossa infraestrutura.' : 'Our portal offers free access to HTML5 games for non-commercial entertainment. It is strictly forbidden to attempt to bypass our security systems, extract or improperly distribute parts of the site, or use bots/scripts to overload our infrastructure.'}</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">{isPt ? '3. Propriedade Intelectual' : '3. Intellectual Property'}</h2>
        <p>{isPt ? 'A marca "FoxChaos", assim como seu logotipo e toda identidade visual associada, são de nossa propriedade exlusiva. Os jogos aqui disponibilizados pertencem a desenvolvedores independentes e parceiros que nos concederam as devidas licenças de uso e exibição.' : 'The "FoxChaos" brand, as well as its logo and all associated visual identity, are our exclusive property. The games provided here belong to independent developers and partners who have granted us the necessary licenses for use and display.'}</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">{isPt ? '4. Isenção de Responsabilidade' : '4. Disclaimer'}</h2>
        <p>{isPt ? 'O serviço é fornecido "no estado em que se encontra". Envidamos todos os esforços para garantir sua disponibilidade, porém, não asseguramos que os jogos estarão livres de erros a todo momento ou que o sistema nunca ficará offline por motivos de manutenção.' : 'The service is provided "as is". We make every effort to ensure its availability, however, we do not guarantee that the games will be error-free at all times or that the system will never go offline for maintenance reasons.'}</p>
        
        <p className="mt-8 pt-8 border-t border-slate-800 text-sm">
          {isPt ? 'Para mais informações legais, contate support@foxchaos.com' : 'For more legal information, contact support@foxchaos.com'}
        </p>
      </div>
    </div>
  );
}
