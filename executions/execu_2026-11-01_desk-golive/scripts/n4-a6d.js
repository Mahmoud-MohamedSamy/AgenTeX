const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=602826bb-1d89-4aaf-82a9-1ab5e469c628', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 90; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /QA NDC Agent id/.test(t)) break; }
const ed = page.locator('button, a', { hasText: /Edit Page Layout/ }).first(); o.edBtn = await ed.count(); if (o.edBtn) { await ed.click().catch(() => {}); }
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC Agent id/.test(t) && !/Loading/.test(t)) break; }
await sleep(2500); o.url = page.url().replace(H, ''); o.editor = await shot('a6/tavi-layout-editor');
const t = (await txt()).replace(/\s+/g, ' '); o.text = t.slice(0, 1200); o.hasRequiredWord = /Required|Mandatory/i.test(t);
const f = page.locator('text=/^QA NDC Agent id/').first(); if (await f.count()) { await f.click().catch(() => {}); await sleep(2500); o.fieldPanel = (await txt()).replace(/\s+/g, ' ').match(/(Required|Mandatory|Field properties|Properties).{0,500}/i)?.[0]; o.fieldShot = await shot('a6/tavi-layout-field'); }
return JSON.stringify(o);
