import { LucideIcon } from 'lucide-react';

interface SeoFooterProps {
  title: string;
  description: string;
  count: number;
  icon?: LucideIcon;
  benefits?: { title: string; content: string }[];
}

export default function SeoFooter({ title, description, count, icon: Icon, benefits = [] }: SeoFooterProps) {
  return (
    <section className="mt-20 border-t border-white/5 pt-16 pb-20">
      <div className="max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          {Icon && (
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon size={24} />
            </div>
          )}
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Tudo sobre Jogos de {title}
          </h2>
        </div>
        
        <div className="prose prose-invert prose-lg text-slate-400 max-w-none space-y-4">
          <p>
            Bem-vindo à nossa coleção exclusiva de <strong>{title}</strong>! No FoxChaos, oferecemos uma curadoria cuidadosa com {count} jogos 
            diferentes nesta categoria, garantindo que você sempre encontre algo novo para jogar. Todos os nossos títulos são em HTML5, 
            o que permite que você jogue instantaneamente em qualquer dispositivo, desde seu celular até seu desktop, sem precisar baixar 
            quaisquer arquivos ou aplicativos.
          </p>
          <p>
            {description}
          </p>
        </div>

        {benefits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {benefits.map((benefit, i) => (
              <div key={i} className="space-y-2">
                <h4 className="text-white font-bold text-lg">{benefit.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{benefit.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
