const res = {};
const src = await page.locator('text=/^qa_r2w5_child$/').first().boundingBox();
const dst = await page.locator('text=/^QA F1$/').first().boundingBox();
await page.mouse.move(332, src.y + src.height / 2); await page.mouse.down();
await page.mouse.move(340, src.y - 5, { steps: 5 }); await page.mouse.move(dst.x + 60, dst.y + dst.height / 2, { steps: 20 }); await sleep(400); await page.mouse.move(dst.x + 70, dst.y + dst.height / 2 + 2, { steps: 5 }); await sleep(400);
await page.mouse.up(); await sleep(1500);
await page.locator('text=/^QA F1$/').first().click().catch(() => {}); await sleep(800);
await shot('c12-1691-after-drag');
res.main = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Create Folder.{0,200}/)?.[0];
// inside-folder module row: delete icon?
const row = page.locator('text=/^qa_r2w5_child$/').first(); const b = await row.boundingBox(); res.rowBox = b;
const near = []; for (const x of await page.$$('main button')) { const bb = await x.boundingBox(); if (bb && b && Math.abs(bb.y - b.y) < 20 && bb.x > b.x) near.push((await x.getAttribute('aria-label')) || (await x.innerText()) || 'icon'); }
res.rowButtons = near;
return res;
