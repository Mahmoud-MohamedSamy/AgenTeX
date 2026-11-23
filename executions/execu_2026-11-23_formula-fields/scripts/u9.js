await page.goto(H + `/modules/${made.mod}/records`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX/.test(await text('main')) && !/Loading/.test(await text('main'))) break; } await sleep(3000);
const heads = await page.locator('[role=columnheader], th').allInnerTexts(); log('headers', heads.map(h => h.trim()).filter(Boolean).slice(0, 60));
await shot('I2-list');
