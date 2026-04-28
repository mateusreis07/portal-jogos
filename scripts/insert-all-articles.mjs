import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

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
    
    // Detect and remove manual slug metadata BEFORE parsing markdown
    let slug = generateSlug(title);
    const slugLineIndex = lines.findIndex(l => l.startsWith('slug: '));
    if (slugLineIndex !== -1) {
      slug = lines[slugLineIndex].replace('slug: ', '').trim();
      lines.splice(slugLineIndex, 1);
    }

    // Also find and remove the title line (re-finding because index might have shifted after slug removal)
    const finalTitleIndex = lines.findIndex(l => l.startsWith('# '));
    if (finalTitleIndex !== -1) {
      lines.splice(finalTitleIndex, 1);
    }

    const rawMarkdown = lines.join('\n').trim();
    const content = marked.parse(rawMarkdown);

    // Detect and remove image_url metadata
    let imageUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'; // Default
    const imageLineIndex = lines.findIndex(l => l.startsWith('image_url: '));
    if (imageLineIndex !== -1) {
      imageUrl = lines[imageLineIndex].replace('image_url: ', '').trim();
      lines.splice(imageLineIndex, 1);
    } else {
      // Heuristic fallback to local headers
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('carro') || lowerTitle.includes('corrida')) imageUrl = '/images/articles/racing-header.png';
      else if (lowerTitle.includes('puzzle') || lowerTitle.includes('cabeça')) imageUrl = '/images/articles/puzzle-header.png';
      else if (lowerTitle.includes('tiro') || lowerTitle.includes('ação')) imageUrl = '/images/articles/low-end-header.png';
      else if (lowerTitle.includes('flash') || lowerTitle.includes('html5')) imageUrl = '/images/articles/evolution-header.png';
      else if (lowerTitle.includes('estresse') || lowerTitle.includes('relaxar') || lowerTitle.includes('pais')) imageUrl = '/images/articles/health-header.png';
      
      // Check if article-X.png exists as absolute fallback
      const articleNum = file.replace('article-', '').replace('.md', '');
      const localImagePath = `/images/articles/article-${articleNum}.png`;
      if (fs.existsSync(path.join(process.cwd(), 'public', localImagePath))) {
        imageUrl = localImagePath;
      }
    }

    // Simple heuristic for target tags based on keywords, defaulting to arcade
    let tag = 'arcade';
    const lowerTitleForTag = title.toLowerCase();
    if (lowerTitleForTag.includes('carro') || lowerTitleForTag.includes('corrida')) tag = 'racing';
    if (lowerTitleForTag.includes('puzzle') || lowerTitleForTag.includes('cabeça')) tag = 'puzzle';
    if (lowerTitleForTag.includes('tiro') || lowerTitleForTag.includes('ação')) tag = 'shooting';
    if (lowerTitleForTag.includes('aventura') || lowerTitleForTag.includes('exploração')) tag = 'adventure';
    if (lowerTitleForTag.includes('estratégia')) tag = 'strategy';

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
          image_url: imageUrl,
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
