const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Go to the app
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Capture initial state
  await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-1-initial.png' });
  console.log('Screenshot 1: Initial state');

  // Try to search for a city (using the geocoding API)
  try {
    const searchButton = await page.locator('[aria-label*="search"], button:has-text("Search"), .search-button').first();
    if (await searchButton.isVisible()) {
      await searchButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-2-search-open.png' });
      console.log('Screenshot 2: Search modal open');
      
      // Type a city name
      const input = await page.locator('input[type="text"], input[placeholder*="search"], input[placeholder*="city"]').first();
      if (await input.isVisible()) {
        await input.fill('São Paulo');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-3-searching.png' });
        console.log('Screenshot 3: Searching for city');
      }
    }
  } catch (e) {
    console.log('Search interaction failed:', e.message);
  }

  // Capture dark mode toggle if available
  try {
    const themeToggle = await page.locator('[aria-label*="theme"], button:has-text("Dark"), button:has-text("Light"), .theme-toggle').first();
    if (await themeToggle.isVisible()) {
      await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-4-with-data.png' });
      console.log('Screenshot 4: With weather data');
    }
  } catch (e) {
    console.log('Theme toggle not found:', e.message);
  }

  // Capture final state
  await page.screenshot({ path: '/home/ukra/www/oc/oc-sample/remotion/out/screenshot-5-final.png' });
  console.log('Screenshot 5: Final state');

  await browser.close();
  console.log('Screenshots captured successfully!');
})();
