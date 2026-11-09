const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=a01a53e7-cec9-4794-b91b-b177cbac2ee8', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 90; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /QA NDC Agent id/.test(t)) break; }
await sleep(2000); o.form = await shot('a6/tavi-cc-create-form');
o.stars = await page.evaluate(() => [...document.querySelectorAll('label')].filter(l => /\*/.test(l.innerText)).map(l => l.innerText.replace(/\s+/g, ' ').trim()).slice(0, 20));
const ed = page.locator('button, a', { hasText: /Edit Page Layout/ }).first(); if (await ed.count()) await ed.click().catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC Agent id/.test(t) && !/Loading/.test(t)) break; }
await sleep(2500); o.editor = await shot('a6/tavi-cc-layout-editor');
const row = page.locator('text=/^QA NDC Agent id/').first(); o.rowText = await row.evaluate(e => e.parentElement.parentElement.innerText.replace(/\s+/g,' ').slice(0,120)).catch(()=>null);
const box = await row.boundingBox().catch(() => null); if (box) { await row.hover().catch(()=>{}); await sleep(600); await page.mouse.click(box.x + 535, box.y + 8); await sleep(1500); }
o.menu = await page.$$eval('[role=menuitem], [role=menu] *', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).filter(Boolean))].slice(0, 20));
o.menuShot = await shot('a6/tavi-cc-field-menu'); await page.keyboard.press('Escape');
return JSON.stringify(o);
