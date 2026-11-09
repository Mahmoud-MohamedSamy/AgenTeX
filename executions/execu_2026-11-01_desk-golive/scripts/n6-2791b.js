const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=238085b7-1d89-4aaf-82a9-1ab5e469c628'.replace('238085b7-1d89-4aaf-82a9-1ab5e469c628', '238085b7-78da-4805-8fb6-6063855256f0'), { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /QA NDC TKT number/.test(t)) break; }
await page.locator('button, a', { hasText: /Edit Page Layout/ }).first().click().catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC TKT number/.test(t) && !/Loading/.test(t)) break; }
await sleep(2000);
const lab = page.locator('text=/^QA NDC TKT number$/').last(); await lab.scrollIntoViewIfNeeded().catch(() => {}); const box = await lab.boundingBox().catch(() => null); o.box = box;
if (box) { await page.mouse.move(box.x + 200, box.y + 8); await sleep(600);
  const btns = await page.evaluate(y => [...document.querySelectorAll('button[aria-label="Field options"]')].map(b => { const r = b.getBoundingClientRect(); return [r.x, r.y]; }).filter(p => Math.abs(p[1] - y) < 25), box.y);
  o.btns = btns; if (btns[0]) { await page.mouse.click(btns[0][0] + 6, btns[0][1] + 6); await sleep(1200); } }
o.menu = await page.$$eval('[role=menuitem]', es => es.map(e => e.innerText.trim()));
const mr = page.locator('[role=menuitem]', { hasText: /^Mark as Required$/ }).first(); o.mr = await mr.count(); if (o.mr) { await mr.click(); await sleep(1500); }
o.marked = await shot('rt/2791-fly-marked');
await page.locator('button', { hasText: /^Save$/ }).last().click().catch(e => o.e = e.message.slice(0, 50)); await sleep(5000);
o.saved = await shot('rt/2791-fly-saved');
return JSON.stringify(o);
