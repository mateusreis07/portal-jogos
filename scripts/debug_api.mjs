

async function test() {
  try {
    const url = 'https://feeds.gamepix.com/v2/json?sid=O31L7&pagination=12&page=1';
    console.log('Fetching:', url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (data.items && data.items[0]) {
      const game = data.items[0];
      console.log('--- GAME DATA ---');
      for (const [key, value] of Object.entries(game)) {
        console.log(`${key}: ${JSON.stringify(value)}`);
      }
    } else {
      console.log('No items found');
    }
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}
test();
