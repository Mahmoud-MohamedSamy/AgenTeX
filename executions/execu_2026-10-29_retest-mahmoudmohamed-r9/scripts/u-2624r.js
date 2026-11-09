// NDC-2624: remove attachment qa-rt-2624-b.txt with its trash icon on the Files tab; confirm; verify only A is left.
const L = 'e647a303-e5a7-46a0-b199-9ef1644ab3c0'; const calls = [];
page.on('response', r => { const m = r.request().method(); if (m === 'DELETE' || (m !== 'GET' && /files|attachments/.test(r.url()))) calls.push(m + ' ' + r.status() + ' ' + r.url().replace(/^https?:\/\/[^/]+/, '').slice(0, 110)); });
const open = async () => { await page.goto(`${H}/modules/${T.LEADS}/records/${L}`, { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=QA RT 2624 timeline lead', { timeout: 120000 }); await sleep(3000); await page.locator('text=/^Files$/').first().click(); await page.waitForSelector('text=qa-rt-2624-b.txt', { timeout: 30000 }); await sleep(1500); };
await open();
const box = await page.locator('text=qa-rt-2624-b.txt').boundingBox();
const btns = await page.$$('button'); let target = null;
for (const b of btns) { const bb = await b.boundingBox(); if (bb && Math.abs(bb.y + bb.height / 2 - (box.y + box.height / 2 + 8)) < 20 && bb.x > 1500) target = b; }
await target.click(); await sleep(1500); await shot('2624-4-confirm.png');
const dlg = await page.$$eval('[role=dialog] button, [role=alertdialog] button', b => b.map(x => x.innerText.trim()));
const c = await page.$('[role=dialog] button:has-text("Delete"), [role=alertdialog] button:has-text("Delete"), [role=alertdialog] button:has-text("Remove"), [role=dialog] button:has-text("Remove")'); if (c) await c.click();
await sleep(6000); await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForSelector('text=QA RT 2624 timeline lead', { timeout: 120000 }); await sleep(2000); await page.locator('text=/^Files$/').first().click(); await sleep(3000); await shot('2624-3-removed.png');
const t = await text(); return { dlg, a: t.includes('qa-rt-2624-a.txt'), b: t.includes('qa-rt-2624-b.txt'), calls };
