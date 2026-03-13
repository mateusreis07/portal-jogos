import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const API_SID = 'O31L7';
const ITEMS_PER_PAGE = 12;

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
    if (subCats.includes(cat) || mainCat === cat) return mainCat;
  }
  return 'arcade';
}

async function reclassify() {
  console.log('🔄 Fetching raw categories from GamePix API (pages 1-80)...');

  // Build a map of game namespace (slug) -> correct category from raw API
  const slugToCategory = {};

  for (let page = 1; page <= 80; page++) {
    const url = `https://feeds.gamepix.com/v2/json?sid=${API_SID}&pagination=${ITEMS_PER_PAGE}&page=${page}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!data.items || data.items.length === 0) break;

      for (const game of data.items) {
        const rawCat = (game.category || '').toLowerCase().trim();
        const correctCat = normalizeCategory(rawCat);
        slugToCategory[game.namespace] = { rawCat, correctCat };
      }
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err.message);
    }
  }

  console.log(`📦 Fetched ${Object.keys(slugToCategory).length} games from API.`);

  // Now fetch all games from Supabase
  const { data: dbGames, error } = await supabase.from('games').select('id, slug, category').limit(2000);
  if (error) {
    console.error('❌ Failed to fetch from Supabase:', error.message);
    process.exit(1);
  }

  console.log(`🗄️ Found ${dbGames.length} games in Supabase.`);

  // Find misclassified games
  let updated = 0;
  let skipped = 0;
  const changes = { puzzle: 0, racing: 0, shooting: 0, adventure: 0, sports: 0, strategy: 0, multiplayer: 0, arcade: 0 };

  for (const dbGame of dbGames) {
    const mapping = slugToCategory[dbGame.slug];
    if (!mapping) { skipped++; continue; }

    if (dbGame.category !== mapping.correctCat) {
      const { error: updateError } = await supabase
        .from('games')
        .update({ category: mapping.correctCat })
        .eq('id', dbGame.id);

      if (updateError) {
        console.error(`❌ Failed to update ${dbGame.slug}:`, updateError.message);
      } else {
        changes[mapping.correctCat]++;
        updated++;
      }
    }
  }

  console.log(`\n✅ Reclassification complete!`);
  console.log(`📊 Updated: ${updated} games | Skipped: ${skipped}`);
  console.log(`\n📂 Games moved to each category:`);
  for (const [cat, count] of Object.entries(changes)) {
    if (count > 0) console.log(`  ${cat}: +${count}`);
  }
}

reclassify();
