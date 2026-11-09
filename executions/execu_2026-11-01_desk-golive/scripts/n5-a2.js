const o = {};
const n = page.locator('text=/loses its owner/').first(); await n.scrollIntoViewIfNeeded().catch(() => {}); await page.mouse.wheel(0, 250); await sleep(1000);
const add = page.locator('button', { hasText: /^\s*Add action\s*$/ }).first(); o.add = await add.count(); if (o.add) { await add.click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1500); }
o.menu = (await txt()).replace(/\s+/g, ' ').match(/Add action.{0,400}/)?.[0];
o.shot = await shot('a2/tavi-actions');
await page.keyboard.press('Escape'); await sleep(500);
return JSON.stringify(o);
