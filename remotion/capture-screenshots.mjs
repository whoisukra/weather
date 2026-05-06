import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Go to the app
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Capture initial state
    await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-1-initial.png' });
    console.log('Screenshot 1: Initial state captured');

    // Try to interact with search - proper way
    try {
      const searchButton = page.locator('button').filter({ hasText: /search|buscar/i }).first();
      const isVisible = await searchButton.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (isVisible) {
        await searchButton.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-2-search-open.png' });
        console.log('Screenshot 2: Search modal open');
        
        // Type a city name
        const input = page.locator('input[type="text"]').first();
        await input.fill('São Paulo');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-3-searching.png' });
        console.log('Screenshot 3: Searching for city');
      }
    } catch (e) {
      console.log('Search interaction skipped:', e.message);
    }

    // Get weather for a default city if possible
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-4-weather.png' });
    console.log('Screenshot 4: Weather displayed');

    // Toggle theme if possible
    try {
      const themeToggle = page.locator('button').filter({ hasText: /dark|light|tema/i }).first();
      const isThemeVisible = await themeToggle.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (isThemeVisible) {
        await themeToggle.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-5-theme.png' });
        console.log('Screenshot 5: Theme toggled');
      }
    } catch (e) {
      console.log('Theme toggle skipped:', e.message);
    }

    // Final screenshot
    await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-6-final.png' });
    console.log('Screenshot 6: Final state captured');

  } catch (error) {
    console.error('Error capturing screenshots:', error.message);
  }

  await browser.close();
  console.log('Screenshots capture completed!');
})();
