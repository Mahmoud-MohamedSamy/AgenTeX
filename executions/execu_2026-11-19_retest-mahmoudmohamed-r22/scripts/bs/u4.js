const ID = '9ec8bdc5-2362-4386-a4cd-e5bee332d0c7'; const out = {};
await page.goto(H + '/views/all/tickets/' + ID, { waitUntil: 'commit' }); await page.evaluate(() => localStorage.setItem('anyware_language', 'ar')); await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(3000); if (/QA reopen/.test(await text())) break; } await sleep(3000);
out.dir = await page.evaluate(() => document.documentElement.dir);
const qa = page.getByRole('button', { name: 'QA reopen', exact: true }); const qb = await qa.boundingBox();
const cands = await page.locator('a,button,[role=link],[role=button]').evaluateAll(es => es.map(e => { const r = e.getBoundingClientRect(); return { t: e.innerText.trim(), x: r.x, y: r.y }; }).filter(o => o.t && o.t.length < 40));
out.near = cands.filter(c => Math.abs(c.y - qb.y) < 25); 
await shot('3056-d1-header-closed-ar.png');
const lbl = out.near.map(c => c.t).find(t => t !== 'QA reopen' && /[\u0600-\u06FF]/.test(t)); out.lbl = lbl;
if (lbl) { await page.getByText(lbl, { exact: true }).last().click(); await sleep(3000); out.popup = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('3056-d2-popup-closed-ar.png'); }
out.stepsLinks = cands.filter(c => c.t === lbl).length;
await page.evaluate(() => localStorage.setItem('anyware_language', 'en'));
return out;
