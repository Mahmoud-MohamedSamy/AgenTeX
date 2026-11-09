const res = {};
const f = await page.locator('text=/^QA F1$/').first().boundingBox();
await page.mouse.click(f.x - 38, f.y + f.height / 2); await sleep(1000);
await shot('c12-1691-folder-open');
res.main = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Create Folder.{0,200}/)?.[0];
const row = page.locator('text=/^qa_r2w5_child$/').first();
if (await row.count()) { const b = await row.boundingBox(); await page.mouse.move(b.x + 30, b.y + 5); await sleep(500); const near = []; for (const x of await page.$$('main button')) { const bb = await x.boundingBox(); if (bb && Math.abs(bb.y - b.y) < 20 && bb.x > b.x) near.push((await x.getAttribute('aria-label')) || (await x.innerText()) || 'icon'); } res.rowButtons = near; await shot('c12-1698-row'); }
return res;
