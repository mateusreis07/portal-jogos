const fs = require('fs');
const path = require('path');

const gamesPath = path.join(process.cwd(), 'data', 'games.json');
const translationsPath = path.join(process.cwd(), 'data', 'translations.json');

const games = JSON.parse(fs.readFileSync(gamesPath, 'utf-8'));
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf-8'));

// Templates - PT
const ptDescTpls = [
  "Chegou a hora de mergulhar em {title}, um dos grandes destaques da nossa categoria de {category}. Prepare-se para explorar níveis criativos e testar suas habilidades enquanto se diverte online. Cada fase de {title} foi projetada para prender sua atenção, especialmente se você gosta de jogos ligados a {tags}.",
  "Seja bem-vindo ao {title}! Este título é um clássico instantâneo para quem procura passatempos do tipo {category}. Sua missão aqui parece simples, mas exige bastante foco e raciocínio rápido. Encare o desafio e veja quantas pontuações consegue bater utilizando mecânicas focadas em {tags}.",
  "Descubra um novo mundo de diversão com {title}. Como um dos títulos mais jogados em {category}, ele oferece uma curva de aprendizado perfeita: fácil de entender, mas muito difícil de dominar! Perfeito para aproveitar no intervalo graças aos seus desafios de {tags}.",
  "Desafie seus reflexos e paciência com {title}. Os entusiastas de jogos de {category} vão se apaixonar rapidamente pelas fases dinâmicas oferecidas aqui. Experimente agora mesmo esta incrível jornada com foco absoluto em {tags} sem precisar baixar nada no seu aparelho.",
  "Prepare-se para muita ação e pensamento estratégico! Em {title}, você encontrará o suprassumo dos jogos de {category}. Supere obstáculos criativos e desbloqueie novas conquistas à medida que você mergulha neste universo repleto de {tags}."
];

const ptInstTpls = [
  "Para jogar {title}, basta utilizar o mouse (no computador) ou o toque diretamente na tela do seu celular. Preste atenção aos tutoriais das primeiras fases para entender o tempo de resposta e o ritmo das partidas.",
  "Os controles de {title} são totalmente intuitivos! Clique ou toque na tela para interagir com o jogo. O segredo na categoria {category} é sempre focar na precisão e não ter pressa nos primeiros níveis.",
  "Interaja utilizando o seu mouse ou tela touch. Ao começar {title}, tente observar os padrões de movimento antes de tomar sua primeira atitude. O botão de dicas (quando disponível) pode salvar muito tempo!",
  "Apenas use toques (ou cliques de mouse) nas áreas ativas do jogo. Quanto mais você treinar os atalhos visuais, mais fácil será passar do nível inicial em {title}.",
  "Clique com o botão esquerdo do mouse ou toque na tela para realizar a ação principal. Gerencie seus movimentos com cautela: em jogos de {category}, cada clique pode ser vital para a sua sobrevivência a longo prazo."
];

// Helper functions to random item
const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const translateCat = (cat) => {
  const map = { puzzle: 'quebra-cabeça', racing: 'corrida', arcade: 'arcade', shooting: 'tiro', adventure: 'aventura', sports: 'esportes', multiplayer: 'multiplayer', strategy: 'estratégia' };
  return map[cat] || cat;
}

let updatedBaseCount = 0;

games.forEach(game => {
  const t = translations[game.id];
  if (!t) return;

  const ptText = t.pt?.description || "";
  const ptInst = t.pt?.instructions || "";
  
  const isGenericDesc = ptText.includes("Um divertido jogo") || ptText.length < 30;
  const isGenericInst = ptInst.includes("Use o toque") || ptInst.length < 20;

  if (isGenericDesc || isGenericInst) {
    const safeTitle = game.title || 'este jogo';
    const safeTags = game.tags ? game.tags.slice(0, 2).join(' e ').replace(/-/g, ' ') : 'desafios divertidos';
    const safeCat = translateCat(game.category || 'arcade');

    if (isGenericDesc) {
      let newDesc = randItem(ptDescTpls)
        .replace(/{title}/g, safeTitle)
        .replace(/{category}/g, safeCat)
        .replace(/{tags}/g, safeTags);
      
      if (!t.pt) t.pt = {};
      t.pt.description = newDesc;
    }

    if (isGenericInst) {
      let newInst = randItem(ptInstTpls)
        .replace(/{title}/g, safeTitle)
        .replace(/{category}/g, safeCat);
      
      if (!t.pt) t.pt = {};
      t.pt.instructions = newInst;
    }
    
    updatedBaseCount++;
  }
});

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf-8');
console.log(`Sucesso: ${updatedBaseCount} jogos tiveram suas descricoes PT-BR enriquecidas!`);
