import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const DATA_FILE = path.join(__dirname, '..', 'data', 'games.json');

async function migrateGames() {
  console.log('🔄 Starting migration to Supabase...');

  if (!fs.existsSync(DATA_FILE)) {
    console.error('❌ JSON data file not found:', DATA_FILE);
    process.exit(1);
  }

  const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
  const games = JSON.parse(rawData);

  console.log(`📦 Found ${games.length} games to migrate.`);

  // Insert in batches of 100 to avoid request limits
  const BATCH_SIZE = 100;
  for (let i = 0; i < games.length; i += BATCH_SIZE) {
    const batch = games.slice(i, i + BATCH_SIZE).map(g => ({
      id: g.id,
      slug: g.slug,
      title: g.title,
      description: g.description,
      instructions: g.instructions,
      category: g.category,
      thumbnail: g.thumbnail,
      gameUrl: g.gameUrl,
      created_at: g.createdAt,
      views: g.views
    }));

    console.log(`📤 Inserting batch ${i / BATCH_SIZE + 1}...`);

    // We use upsert so the script can be run multiple times without duplicating data
    const { error } = await supabase.from('games').upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Migration failed at batch ${i / BATCH_SIZE + 1}:`, error.message, error.details);
      // Wait before exit to give some time for logs
      await new Promise(r => setTimeout(r, 1000));
      process.exit(1);
    }
  }

  console.log('🎉 Migration completed successfully!');
}

migrateGames();
