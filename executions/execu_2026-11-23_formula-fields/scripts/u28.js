await page.goto(H + `/modules/${made.mod}/views/${made.kanban}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/I11 green/.test(await text('main'))) break; } await sleep(2000);
const t = await text('main'); const i = t.indexOf('Green'); log('board', JSON.stringify(t.slice(Math.max(0, i - 20), i + 300))); await shot('I11-kanban');
