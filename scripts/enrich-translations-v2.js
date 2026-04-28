const fs = require('fs');
const path = require('path');

const gamesPath = path.join(process.cwd(), 'data', 'games.json');
const translationsPath = path.join(process.cwd(), 'data', 'translations.json');

const games = JSON.parse(fs.readFileSync(gamesPath, 'utf-8'));
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf-8'));

const ptDescTpls = [
  "Mergulhe em {title}, um destaque em {category}. Explore níveis criativos e teste habilidades em {tags}.",
  "Bem-vindo ao {title}! Um clássico de {category} que exige foco e raciocínio em {tags}.",
  "Descubra a diversão com {title}. Líder em {category}, oferece aprendizado rápido em {tags}.",
  "Desafie reflexos com {title}. Entusiastas de {category} vão amar as fases de {tags}.",
  "Ação e estratégia em {title}. O melhor de {category} com obstáculos de {tags}.",
  "Explore o universo de {title}. Um título imperdível de {category} focado em {tags}.",
  "Teste seus limites em {title}. Perfeito para fãs de {category} que buscam {tags}.",
  "Viva a experiência de {title}. Muita diversão em {category} com elementos de {tags}.",
  "Domine as pistas de {title}. Referência em {category} para quem gosta de {tags}.",
  "Encare o desafio de {title}. Estratégia pura em {category} com foco em {tags}.",
  "Supere-se em {title}. Um jogo dinâmico de {category} com desafios de {tags}.",
  "Divirta-se agora com {title}. O passatempo ideal de {category} explorando {tags}.",
  "Sinta a adrenalina em {title}. Ação ininterrupta em {category} com {tags}.",
  "Aprimore sua lógica em {title}. O melhor puzzle de {category} usando {tags}.",
  "Jogue {title} gratuitamente. Qualidade máxima em {category} com foco em {tags}.",
  "Descubra segredos em {title}. Aventura épica em {category} repleta de {tags}.",
  "Seja o campeão em {title}. Competição acirrada em {category} com {tags}.",
  "Relaxe jogando {title}. Diversão garantida em {category} com temas de {tags}.",
  "O mundo de {title} espera por você. Explore {category} com mecânicas de {tags}.",
  "Sua jornada em {title} começa aqui. O ápice de {category} com desafios de {tags}."
];

const ptInstTpls = [
  "Use o mouse ou toque na tela para jogar {title}. Fique atento ao ritmo de {category}.",
  "Controles intuitivos: clique ou toque para interagir em {title}. Precisão é chave.",
  "Interaja com mouse ou touch. Em {title}, observe os padrões antes de agir.",
  "Toque ou clique nas áreas ativas. Treine sua visão para vencer em {title}.",
  "Ação principal via clique ou toque. Gerencie movimentos com cautela em {category}.",
  "Mantenha o foco nos alvos e use o clique para disparar em {title}.",
  "Arraste as peças com o mouse para resolver o desafio de {category}.",
  "Em dispositivos móveis, deslize para mover. No PC, use as setas ou mouse.",
  "O segredo de {title} é o timing. Clique no momento exato para pontuar.",
  "Combine elementos clicando neles. Explore a lógica de {category}.",
  "Para acelerar, mantenha pressionado. Para frear, solte o comando.",
  "Navegue pelos menus e use o botão principal para confirmar ações.",
  "Siga o tutorial inicial de {title} para dominar os controles de {category}.",
  "Cada nível exige uma nova abordagem. Use o mouse para explorar o cenário.",
  "Pressione e segure para carregar o poder, solte para liberar em {title}.",
  "Toque duplo realiza ações especiais. Fique de olho na barra de energia.",
  "Coordenação motora é essencial aqui. Use toques rápidos e precisos.",
  "Em {category}, cada movimento conta. Planeje antes de clicar em {title}.",
  "Desbloqueie conquistas interagindo com os itens ocultos no mapa.",
  "Divirta-se explorando as mecânicas únicas que {title} oferece!"
];

const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const translateCat = (cat) => {
  const map = { puzzle: 'quebra-cabeça', racing: 'corrida', arcade: 'arcade', shooting: 'tiro', adventure: 'aventura', sports: 'esportes', multiplayer: 'multiplayer', strategy: 'estratégia' };
  return map[cat] || cat;
}

let updatedCount = 0;

games.forEach(game => {
  const t = translations[game.id];
  if (!t) return;

  const safeTitle = game.title || 'este jogo';
  const safeTags = game.tags ? game.tags.slice(0, 2).join(' e ').replace(/-/g, ' ') : 'desafios divertidos';
  const safeCat = translateCat(game.category || 'arcade');

  t.pt = t.pt || {};
  t.pt.description = randItem(ptDescTpls).replace(/{title}/g, safeTitle).replace(/{category}/g, safeCat).replace(/{tags}/g, safeTags);
  t.pt.instructions = randItem(ptInstTpls).replace(/{title}/g, safeTitle).replace(/{category}/g, safeCat);
  
  updatedCount++;
});

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf-8');
console.log(`Sucesso: ${updatedCount} jogos foram atualizados com 20 variações de templates!`);
