const res = {};
await page.locator('label, li, div[role=option], button', { hasText: /^qa_r2w5_child$/ }).first().click(); await sleep(500);
const sel = page.locator('select').last(); if (await sel.count()) { res.folders = await sel.evaluate(s => [...s.options].map(o => o.text)); const f = res.folders.find(x => /QA F1/.test(x)); if (f) await sel.selectOption({ label: f }); }
else { await page.locator('button', { hasText: /^Root$/ }).last().click(); await sleep(800); res.folders = await page.$$eval('[role=option]', os => os.map(o => o.innerText.trim())); await page.locator('[role=option]', { hasText: 'QA F1' }).first().click().catch(() => {}); }
await sleep(500); await shot('c12-add-picked');
await page.locator('button', { hasText: /^Add$/ }).last().click(); await sleep(1500);
await shot('c12-before-save');
res.leftPaneBefore = await page.evaluate(() => { const n = document.querySelector('nav, aside'); return n ? n.innerText.replace(/\s+/g, ' ').slice(0, 400) : ''; });
res.main = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Modules Associate.{0,300}/)?.[0];
return res;
