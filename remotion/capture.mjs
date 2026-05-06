import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'out/1-initial.png', fullPage: false });
    console.log('✓ Screenshot 1: Initial state');

    // Try search
    try {
      await page.click('button[aria-label*="search" i], button:has-text("Buscar"), button:has-text("Search")', { timeout: 2000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'out/2-search-open.png' });
      console.log('✓ Screenshot 2: Search modal');
      
      await page.fill('input[type="text"]', 'São Paulo');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'out/3-searching.png' });
      console.log('✓ Screenshot 3: Searching');
    } catch (e) {
      console.log('Search not found, continuing...');
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'out/4-weather.png' });
    console.log('✓ Screenshot 4: Weather data');

    // Toggle theme
    try {
      await page.click('button[aria-label*="theme" i], button:has-text("Dark"), button:has-text("Light")', { timeout: 2000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'out/5-theme.png' });
      console.log('✓ Screenshot 5: Theme toggled');
    } catch (e) {
      console.log('Theme toggle not found, continuing...');
    }

    await page.screenshot({ path: 'out/6-final.png' });
    console.log('✓ Screenshot 6: Final state');
    
  } catch (error) {
    console.error('Error:', error.message);
  }

  await browser.close();
  console.log('Done!');
})();
