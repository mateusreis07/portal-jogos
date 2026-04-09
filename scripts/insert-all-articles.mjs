import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function insertAllArticles() {
  const draftsDir = path.join(process.cwd(), 'articles_drafts');
  const files = fs.readdirSync(draftsDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(draftsDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf8');

    const lines = rawContent.split('\n');
    const titleLineIndex = lines.findIndex(l => l.startsWith('# '));
    
    if (titleLineIndex === -1) {
      console.warn(`Skipping ${file}: No H1 title found`);
      continue;
    }

    const title = lines[titleLineIndex].replace('# ', '').trim();
    // Remove the title line from content explicitly
    lines.splice(titleLineIndex, 1);
    const content = lines.join('\n').trim();
    
    const slug = generateSlug(title);

    // Simple heuristic for target tags based on keywords, defaulting to arcade
    let tag = 'arcade';
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('carro') || lowerTitle.includes('corrida')) tag = 'car-games';
    if (lowerTitle.includes('puzzle') || lowerTitle.includes('cabeça')) tag = 'puzzle';
    if (lowerTitle.includes('tiro') || lowerTitle.includes('ação')) tag = 'shooting';

    const { data, error } = await supabase
      .from('articles')
      .upsert([
        {
          slug: slug,
          locale: 'pt-BR',
          title: title,
          meta_description: title + ' - Dicas e novidades no FoxChaos.',
          content: content,
          target_tag: tag,
          image_url: null,
          published: true,
        }
      ], { onConflict: 'slug, locale' });

    if (error) {
      console.error(`Error inserting article from ${file}:`, error);
    } else {
      console.log(`Inserted: ${title} (${slug})`);
    }
  }
}

insertAllArticles();
