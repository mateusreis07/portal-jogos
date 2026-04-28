import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function extractHeroImages() {
  console.log('Starting hero image extraction...');
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, slug, content, image_url');

  if (error) {
    console.error('Error fetching articles:', error);
    return;
  }

  for (const article of articles) {
    // Regex to find <img> src or Markdown ![]() image URLs
    const imgRegex = /<img.*?src=["'](.*?)["']|!\[.*?\]\((.*?)\)/i;
    const match = article.content.match(imgRegex);
    
    if (match) {
      const imgUrl = match[1] || match[2];
      
      // If the current image_url is missing or looks like a placeholder, update it
      if (!article.image_url || article.image_url.includes('unsplash') || article.image_url.includes('placeholder')) {
        console.log(`Found image in content for "${article.slug}": ${imgUrl}`);
        
        const { error: updateError } = await supabase
          .from('articles')
          .update({ image_url: imgUrl })
          .eq('id', article.id);

        if (updateError) {
          console.error(`Error updating article ${article.slug}:`, updateError);
        } else {
          console.log(`Successfully updated hero image for ${article.slug}`);
        }
      }
    } else {
      console.log(`No images found in content for "${article.slug}"`);
    }
  }
}

extractHeroImages();
