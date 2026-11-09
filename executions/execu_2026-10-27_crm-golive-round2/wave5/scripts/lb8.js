const res = {};
const f = page.locator('text=/^Lookup Contacts R2W5$/').first();
const b = await f.boundingBox(); res.box = b;
await page.mouse.move(b.x + 50, b.y + 5); await sleep(800);
// the row's kebab button: nearest button to the right on the same row
const btns = await page.$$('main button'); let best = null, bd = 1e9;
for (const x of btns) { const bb = await x.boundingBox(); if (!bb) continue; const dy = Math.abs((bb.y + bb.height / 2) - (b.y + b.height / 2)), dx = bb.x - b.x; if (dy < 25 && dx > 0 && dx < 600 && dx < bd) { bd = dx; best = x; } }
res.found = !!best; if (best) { res.btnLabel = await best.getAttribute('aria-label'); }
const kebabs = await page.$$eval('main button', bs => bs.map(b => b.getAttribute('aria-label')).filter(a => a && /option|more|menu|action/i.test(a)).slice(0, 10)); res.kebabs = kebabs;
await shot('lb-hover-field');
return res;
