await page.goto(B + '/', { waitUntil: 'domcontentloaded' }); await sleep(6000);
await page.locator('header button:has-text("AR")').first().click(); await sleep(800);
await page.locator('text=English').first().click(); await sleep(4000);
out.after = await page.evaluate(() => ({ lang: localStorage.getItem('anyware_language'), html: document.documentElement.lang, dir: document.documentElement.dir }));
await page.reload(); await sleep(6000);
out.afterReload = await page.evaluate(() => ({ lang: localStorage.getItem('anyware_language'), html: document.documentElement.lang, dir: document.documentElement.dir }));
