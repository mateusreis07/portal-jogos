import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  const { data, count, error } = await supabase
    .from('articles')
    .select('title, content, slug', { count: 'exact' });

  if (error) {
    console.error('Erro na verificação:', error);
    return;
  }

  console.log(`Total de artigos no banco: ${count}`);
  
  if (data && data.length > 0) {
    const first = data[0];
    console.log(`\nVerificando formato do artigo: "${first.title}"`);
    const isHtml = first.content.includes('<p>') || first.content.includes('<h1>') || first.content.includes('<h2>');
    console.log(`Formato HTML detectado: ${isHtml ? '✅ SIM' : '❌ NÃO (Ainda Markdown!)'}`);
    
    if (!isHtml) {
      console.log('Amostra do conteúdo:', first.content.substring(0, 100));
    }
  }
}

verify();
