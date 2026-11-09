const res = {};
res.url = page.url().replace(H, '');
res.inputs = await page.$$eval('main input', is => is.map(i => i.placeholder + '=' + i.value));
const inp = page.locator('main input[placeholder="Untitled Teamspace"]').first();
const card = await inp.boundingBox(); res.card = card;
const btns = []; for (const x of await page.$$('main button')) { const bb = await x.boundingBox(); if (bb && card && Math.abs(bb.y - card.y) < 40 && bb.x > card.x + 100) btns.push({ x: Math.round(bb.x), y: Math.round(bb.y), label: (await x.getAttribute('aria-label')) || (await x.getAttribute('title')) || (await x.innerText()) }); }
res.cardButtons = btns;
await shot('c12-1689-edit');
return res;
