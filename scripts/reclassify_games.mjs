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

  // Build a map of game ID -> correct category from raw API
  const idToCorrectCat = {};

  for (let page = 1; page <= 80; page++) {
    const url = `https://feeds.gamepix.com/v2/json?sid=${API_SID}&pagination=${ITEMS_PER_PAGE}&page=${page}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!data.items || data.items.length === 0) break;

      for (const game of data.items) {
        const rawCat = (game.category || '').toLowerCase().trim();
        const correctCat = normalizeCategory(rawCat);
        const gameId = game.id || Math.random().toString(36).substr(2, 9);
        idToCorrectCat[game.namespace] = { id: gameId, correctCat, rawCat };
      }
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err.message);
    }
  }

  console.log(`📦 Fetched ${Object.keys(idToCorrectCat).length} games from API.`);

  // Fetch all games from Supabase
  const { data: dbGames, error } = await supabase.from('games').select('*').limit(2000);
  if (error) {
    console.error('❌ Failed to fetch from Supabase:', error.message);
    process.exit(1);
  }

  console.log(`🗄️ Found ${dbGames.length} games in Supabase.`);

  // Find games that need reclassification
  const toUpdate = [];
  for (const dbGame of dbGames) {
    const mapping = idToCorrectCat[dbGame.slug];
    if (mapping && dbGame.category !== mapping.correctCat) {
      toUpdate.push({
        ...dbGame,
        category: mapping.correctCat
      });
    }
  }

  console.log(`🔄 ${toUpdate.length} games need reclassification.`);

  if (toUpdate.length === 0) {
    console.log('✅ All games are already correctly classified!');
    return;
  }

  // Delete and re-insert games that need reclassification (RLS may block update/upsert)
  const BATCH_SIZE = 50;
  const changes = {};
  
  for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
    const batch = toUpdate.slice(i, i + BATCH_SIZE);
    const batchIds = batch.map(g => g.id);
    console.log(`📤 Reclassifying batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} games)...`);

    // Step 1: Delete old rows
    const { error: deleteError } = await supabase.from('games').delete().in('id', batchIds);
    if (deleteError) {
      console.error(`❌ Delete failed:`, deleteError.message);
      process.exit(1);
    }

    // Step 2: Re-insert with correct category
    const { error: insertError } = await supabase.from('games').insert(batch);
    if (insertError) {
      console.error(`❌ Insert failed:`, insertError.message);
      process.exit(1);
    }

    batch.forEach(g => {
      changes[g.category] = (changes[g.category] || 0) + 1;
    });
  }

  console.log(`\n✅ Reclassification complete! Updated ${toUpdate.length} games.`);
  console.log(`\n📂 Games moved to each category:`);
  for (const [cat, count] of Object.entries(changes).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${cat}: +${count}`);
  }

  // Verify
  const { data: verify } = await supabase.from('games').select('category').limit(2000);
  const finalCounts = {};
  verify.forEach(g => { finalCounts[g.category] = (finalCounts[g.category] || 0) + 1; });
  console.log(`\n📊 Final category counts:`);
  Object.entries(finalCounts).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
}

reclassify();
