async (page) => { await page.keyboard.press('Escape'); await page.goto(HOST + '/', { waitUntil: 'domcontentloaded' }); return 1; }
