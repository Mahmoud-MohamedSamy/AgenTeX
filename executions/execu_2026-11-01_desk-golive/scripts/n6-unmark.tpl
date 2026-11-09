const o = {}; const LAYOUT = '__L__', FIELD = '__F__'; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=' + LAYOUT, { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && t.includes(FIELD)) break; }
await page.locator('button, a', { hasText: /Edit Page Layout/ }).first().click().catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (t.includes(FIELD) && !/Loading/.test(t)) break; }
await sleep(2000);
const lab = page.locator('text=/^' + FIELD + '\s*\*?$/').last(); await lab.scrollIntoViewIfNeeded().catch(() => {}); const box = await lab.boundingBox().catch(() => null);
await page.mouse.move(box.x + 200, box.y + 8); await sleep(700);
const b = await page.evaluate(y => [...document.querySelectorAll('button[aria-label="Field options"]')].map(b => { const r = b.getBoundingClientRect(); return [r.x, r.y]; }).filter(p => Math.abs(p[1] - y) < 25)[0], box.y);
await page.mouse.click(b[0] + 6, b[1] + 6); await sleep(1500);
const um = page.getByText('Unmark as Required', { exact: true }).first(); o.um = await um.isVisible().catch(() => false);
if (o.um) { await um.click(); await sleep(1500); }
const sv = page.locator('button', { hasText: /^Save$/ }).last(); await sv.click().catch(e => o.e = e.message.slice(0, 50)); await sleep(5000);
o.shot = await shot('rt/unmark-' + LAYOUT.slice(0, 8));
return JSON.stringify(o);
