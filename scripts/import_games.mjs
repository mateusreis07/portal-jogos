import fs from 'fs';
import path from 'path';

const API_SID = 'O31L7';
const TOTAL_PAGES_TO_FETCH = 40;
const ITEMS_PER_PAGE = 12;
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'games.json');

async function importGames() {
  console.log('🔄 Starting GamePix Import...');
  let allGames = [];

  for (let page = 1; page <= TOTAL_PAGES_TO_FETCH; page++) {
    const url = `https://feeds.gamepix.com/v2/json?sid=${API_SID}&pagination=${ITEMS_PER_PAGE}&page=${page}`;
    console.log(`📥 Fetching page ${page}... (${url})`);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        console.log('⚠️ No more games found on this page. Stopping fetch.');
        break;
      }

      // Map GamePix format to our Portal format
      const formattedGames = data.items.map(game => {
        // Strip the width query parameter to get the highest resolution banner if possible,
        // or just use the banner_image as provided
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
          category: (game.category || 'arcade').toLowerCase(),
          thumbnail: thumbnail || 'https://via.placeholder.com/320x320?text=No+Image',
          gameUrl: game.url,
          createdAt: game.date_published || new Date().toISOString(),
          views: Math.floor(Math.random() * (50000 - 100) + 100) // Random views for mock
        };
      });

      allGames = allGames.concat(formattedGames);
      console.log(`✅ Page ${page} processed. Total games so far: ${allGames.length}`);
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
