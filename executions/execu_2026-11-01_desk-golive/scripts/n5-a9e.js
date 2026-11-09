const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=602826bb-1d89-4aaf-82a9-1ab5e469c628', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /QA NDC Agent id/.test(t)) break; }
await page.locator('button, a', { hasText: /Edit Page Layout/ }).first().click().catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC Agent id/.test(t) && !/Loading/.test(t)) break; }
await sleep(2000);
const row = page.locator('text=/^Status$/').first(); const box = await row.boundingBox().catch(() => null); o.box = box;
if (box) { await row.hover().catch(() => {}); await sleep(600); await page.mouse.click(box.x + 535, box.y + 8); await sleep(1500); }
o.menu = await page.$$eval('[role=menuitem], [role=menu] *', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).filter(Boolean))].slice(0, 20));
o.shot = await shot('a9/tavi-status-menu');
return JSON.stringify(o);
