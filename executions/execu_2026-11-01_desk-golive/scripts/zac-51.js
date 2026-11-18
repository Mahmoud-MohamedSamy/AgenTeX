await page.mouse.move(900, 500); for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 500); await page.waitForTimeout(500); }
await page.waitForTimeout(1000); await shotZ(page, 'ac2-notif-dept');
