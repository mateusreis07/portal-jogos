import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://cmcawupztamsbnwxexbo.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtY2F3dXB6dGFtc2Jud3hleGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxODA5MzQsImV4cCI6MjA4ODc1NjkzNH0.sKROHEDwr03KEtzkZyLp7FpnzBtneoYM17L1I1rCVng';
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'translations.json');

async function translateText(text, targetLang) {
  if (!text) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map((item) => item[0]).join('');
  } catch (error) {
    console.error(`Error translating text to ${targetLang}:`, error.message);
    return text; // fallback
  }
}

async function run() {
  console.log('Fetching games from Supabase...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/games?select=id,description,instructions&limit=2000`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });

  const games = await res.json();
  console.log(`Found ${games.length} games in Supabase.`);

  // Load existing translations to skip already-translated games
  let translations = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    translations = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    console.log(`📦 Loaded ${Object.keys(translations).length} existing translations. Will skip those.`);
  }

  const gamesToTranslate = games.filter(g => !translations[g.id]);
  console.log(`🆕 ${gamesToTranslate.length} new games need translation.`);

  if (gamesToTranslate.length === 0) {
    console.log('✅ All games already translated!');
    return;
  }

  let i = 0;
  for (const game of gamesToTranslate) {
    i++;
    console.log(`[${i}/${gamesToTranslate.length}] Translating game ID: ${game.id}`);

    // Portuguese
    const descPt = await translateText(game.description, 'pt');
    const instPt = await translateText(game.instructions, 'pt');

    // Spanish
    const descEs = await translateText(game.description, 'es');
    const instEs = await translateText(game.instructions, 'es');

    translations[game.id] = {
      pt: { description: descPt, instructions: instPt },
      es: { description: descEs, instructions: instEs },
      en: { description: game.description, instructions: game.instructions }
    };

    // Quick delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Ensure directory exists
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(translations, null, 2), 'utf-8');
  console.log(`Translations saved successfully to ${OUTPUT_FILE}`);
}

run();
