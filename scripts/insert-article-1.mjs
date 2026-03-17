import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const articleContent = `
<p>Se você é fã de alta velocidade, adrenalina e o cheiro virtual de pneus queimados, você chegou ao lugar certo. Os jogos de carros sempre foram a espinha dorsal do entretenimento digital, e com o avanço da tecnologia HTML5, a experiência de pilotar máquinas potentes direto no seu navegador nunca foi tão imersiva e acessível.</p>

<h2>Por que os jogos de carros em HTML5 são tão populares?</h2>
<p>Antigamente, para desfrutar de um simulador de corrida com bons gráficos, era necessário baixar gigabytes de dados ou possuir um console de última geração. No <strong>FoxChaos</strong>, quebramos essa barreira. Nossos jogos são desenvolvidos para carregar instantaneamente, funcionando perfeitamente tanto no seu computador quanto no seu smartphone Android ou iPhone.</p>
<p>A tecnologia HTML5 permite que os desenvolvedores criem efeitos de física realistas, reflexos em tempo real e controles responsivos que respondem perfeitamente ao teclado ou ao toque na tela.</p>

<h2>Categorias de jogos de carros que você encontra no FoxChaos</h2>
<p>Nossa biblioteca é vasta e atende a todos os tipos de "pilotos":</p>
<ul>
  <li><strong>Drift Urbano:</strong> Domine a arte de derrapar em curvas fechadas e acumule pontos com estilo.</li>
  <li><strong>Simuladores de Estacionamento:</strong> Para quem prefere precisão e paciência, testando suas habilidades em espaços apertados.</li>
  <li><strong>Corridas de Rali Off-road:</strong> Enfrente lama, areia e terrenos acidentados em veículos 4x4 potentes.</li>
  <li><strong>Fuga Policial:</strong> Sinta a tensão de ser perseguido em alta velocidade pelas ruas da cidade.</li>
</ul>

<h2>Top 3 Estilos de Pilotagem Imperdíveis</h2>
<p>Se você está indeciso por onde começar, aqui estão os estilos que mais atraem nossa comunidade:</p>
<h3>1. Drift e Velocidade</h3>
<p>Jogos que focam em derrapagens controladas são ideais para quem gosta de exibicionismo técnico. O segredo aqui é manter o equilíbrio entre a aceleração e o ângulo de giro.</p>
<h3>2. Corrida de Circuito Tradicional</h3>
<p>A clássica busca pela linha de chegada. Aqui, o que importa é o conhecimento da pista, o tempo de frenagem e a estratégia de ultrapassagem.</p>
<h3>3. Stunt Games (Manobras Radicais)</h3>
<p>Quem disse que carros precisam ficar no chão? Explore arenas cheias de rampas, loops e saltos mortais para realizar manobras de tirar o fôlego.</p>

<h2>Dicas para dominar a pista no FoxChaos</h2>
<p>Para se tornar um mestre volante, siga estas dicas básicas:</p>
<ol>
  <li><strong>Conheça seus controles:</strong> Antes de acelerar fundo, teste como o carro responde às setas do teclado ou ao acelerômetro do celular.</li>
  <li><strong>Use o freio de mão com sabedoria:</strong> Ele é seu melhor amigo para curvas em drift, mas pode fazer você perder muita velocidade se usado incorretamente.</li>
  <li><strong>Mantenha a calma:</strong> Em corridas acirradas, o erro do oponente costuma vir de quem tenta forçar demais. Espere o momento certo para a ultrapassagem.</li>
</ol>

<h2>Conclusão</h2>
<p>No <strong>FoxChaos</strong>, nossa missão é levar a diversão das pistas para a palma da sua mão ou para a tela do seu PC com zero de fricção. Sem downloads, sem esperas irritantes — apenas você e a máquina. Explore nossa categoria de jogos de carros agora e descubra por que somos o destino favorito de milhares de jogadores todos os meses.</p>
`;

async function insertArticle() {
  const { data, error } = await supabase
    .from('articles')
    .upsert([
      {
        slug: 'os-melhores-jogos-de-carros-online-navegador',
        locale: 'pt-BR',
        title: 'Os Melhores Jogos de Carros Online Para Jogar no Navegador',
        meta_description: 'Descubra os melhores jogos de carros online grátis no FoxChaos. Drifts, simuladores e ralis em HTML5 para jogar agora no seu navegador sem download.',
        content: articleContent,
        target_tag: 'car-games',
        image_url: '/images/articles/racing-header.png', // Path to the generated image
        published: true,
      }
    ], { onConflict: 'slug, locale' });

  if (error) {
    console.error('Error inserting article:', error);
  } else {
    console.log('Article inserted successfully!');
  }
}

insertArticle();
