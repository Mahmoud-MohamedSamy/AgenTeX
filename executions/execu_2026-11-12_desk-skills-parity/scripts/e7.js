async (page) => { await page.keyboard.press('Escape'); await page.waitForTimeout(800); return 'closed'; }
