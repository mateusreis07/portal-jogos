import fs from 'fs';
import path from 'path';

const API_SID = 'O31L7';
const START_PAGE = 41;
const END_PAGE = 80; // Pages 41 to 80 * 12 items = 480 new games
const ITEMS_PER_PAGE = 12;
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'games.json');

// We want to normalize GamePix's hundreds of categories into our portal's 8 core categories:
const categoryMapping = {
  'puzzle': ['puzzle', 'match-3', '2048', 'memory', 'mahjong', 'sudoku', 'logic', 'tetris', 'blocks', 'word', 'board', 'trivia', 'brain', 'math', 'jigsaw-puzzles', 'hidden-object', 'jewel', 'block'],
  'racing': ['racing', 'car', 'bike', 'motorcycle', 'driving', 'drift', 'parking', 'truck', 'dirt-bike', 'flight', 'airplane'],
  'shooting': ['shooting', 'gun', 'sniper', 'fps', 'zombie', 'battle', 'tank', 'archery', 'fighting', 'shooter', 'first-person-shooter', 'tanks', 'war', 'gangster', 'hunting', 'ninja'],
  'adventure': ['adventure', 'platformer', 'rpg', 'exploration', 'escape', 'survival', 'monster', 'dinosaur', 'parkour', 'horror', 'scary', 'granny', 'snake'],
  'sports': ['sports', 'football', 'basketball', 'soccer', 'tennis', 'golf', 'pool', 'fishing', 'boxing', 'bowling', 'ball', 'baseball', 'skateboard'],
  'strategy': ['strategy', 'tower-defense', 'card', 'chess', 'simulation', 'management', 'idle', 'clicker', 'building', 'minecraft', 'farming', 'money'],
  'multiplayer': ['multiplayer', 'io', '2-player', '3d-multiplayer', 'coop', 'mmo', 'two-player'],
  'arcade': ['arcade', 'action', 'casual', 'stickman', 'drawing', 'kids', 'funny', 'animal', 'bubble-shooter', 'running', 'jumping', 'skill', 'fun', 'runner', 'skibidi-toilet', 'hyper-casual', 'addictive', 'music', 'pixel', 'retro', 'mobile', 'robots', 'christmas', 'spinner', 'coloring', 'games-for-girls', 'fashion', 'crazy', 'dress-up', 'mermaid', 'cats', 'tap', 'surgery', 'educational']
};

function normalizeCategory(rawCategory) {
  const cat = (rawCategory || '').toLowerCase().trim();
  for (const [mainCat, subCats] of Object.entries(categoryMapping)) {
    if (subCats.includes(cat) || mainCat === cat) {
      return mainCat;
    }
  }
  // Fallback to arcade if it's too obscure
  return 'arcade';
}

async function importGames() {
  console.log('🔄 Starting GamePix Import...');
  let allGames = [];

  for (let page = START_PAGE; page <= END_PAGE; page++) {
    const url = `https://feeds.gamepix.com/v2/json?sid=${API_SID}&pagination=${ITEMS_PER_PAGE}&page=${page}`;
    console.log(`📥 Fetching page ${page}...`);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        console.log('⚠️ No more games found on this page. Stopping fetch.');
        break;
      }

      const formattedGames = data.items.map(game => {
        let thumbnail = game.banner_image;
        if (thumbnail && thumbnail.includes('?w=')) {
          thumbnail = thumbnail.split('?w=')[0];
        } else if (game.image) {
          thumbnail = game.image;
        }

        return {
          id: game.id || Math.random().toString(36).substr(2, 9),
          slug: game.namespace,
          title: game.title,
          description: game.description || 'A fun HTML5 game.',
          instructions: 'Use touch or mouse to play.',
          category: normalizeCategory(game.category),
          thumbnail: thumbnail || 'https://via.placeholder.com/320x320?text=No+Image',
          gameUrl: game.url,
          createdAt: game.date_published || new Date().toISOString(),
          views: Math.floor(Math.random() * (50000 - 100) + 100)
        };
      });

      allGames = allGames.concat(formattedGames);
    } catch (error) {
      console.error(`❌ Failed to fetch page ${page}:`, error.message);
      break;
    }
  }

  if (allGames.length > 0) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allGames, null, 2), 'utf-8');
    console.log(`🎉 Success! Saved ${allGames.length} games to ${OUTPUT_FILE}`);
  } else {
    console.log('⚠️ No games were imported.');
  }
}

importGames();
