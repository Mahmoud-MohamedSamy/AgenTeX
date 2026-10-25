const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(H + `/modules/${D}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 120; k++) { await sleep(1000); const t = await txt().catch(() => ''); if (/\d records/.test(t) && !/Loading/.test(t)) break; }
const toggles = await page.evaluate(() => [...document.querySelectorAll('button[aria-label], [role=tab], [role=radio]')].map(b => b.getAttribute('aria-label') || b.innerText.trim()).filter(x => /kanban|list|split|board|view/i.test(x)).slice(0, 15));
const kb = page.getByRole('button', { name: /kanban/i }).first().or(page.getByRole('radio', { name: /kanban/i }).first()).first();
if (await kb.count()) { await kb.click(); await sleep(4000); }
for (let k = 0; k < 60; k++) { await sleep(1000); if ((await txt()).includes('Unaccounted')) break; }
await shot('2113-01-board');
const t = await txt(); return done({ toggles, url: page.url().replace(H, ''), hasUnacc: t.includes('Unaccounted'), cols: (t.match(/\n[^\n]{1,40}\n\d+\n/g) || []).slice(0, 12) });
