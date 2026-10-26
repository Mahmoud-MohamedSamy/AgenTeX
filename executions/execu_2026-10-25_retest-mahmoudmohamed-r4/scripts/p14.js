// NDC-1324: Deals list → inline edit Pipeline on "QA RT 1302 move".
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', ID = '5712b381-59ee-4cb4-b025-b7a834d74d86';
await page.goto(H + `/modules/${D}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/[1-9]\d* records/.test(await txt().catch(() => ''))) break; } await sleep(1500);
const hdr = await page.evaluate(() => [...document.querySelectorAll('thead th')].map(t => t.innerText.trim()).filter(Boolean));
// make Pipeline column visible via Manage columns if missing
let added = false;
if (!hdr.includes('Pipeline')) { await page.getByRole('button', { name: /Manage columns|Table settings/ }).first().click(); await sleep(1000); const mc = page.getByText('Manage Columns', { exact: true }); if (await mc.count()) { await mc.first().click(); await sleep(1200); } const dlg = page.locator('[role=dialog]').last(); const s = dlg.getByPlaceholder(/search/i); if (await s.count()) await s.fill('Pipeline'); await sleep(800); const show = dlg.locator('button[aria-label^="Show "], button[aria-label*="Pipeline"]').first(); const lbls = await dlg.locator('button[aria-label]').evaluateAll(es => es.map(e => e.getAttribute('aria-label')).filter(a => /pipeline/i.test(a))); added = lbls; if (await show.count()) { await show.click(); await sleep(400); } await dlg.getByRole('button', { name: 'Apply' }).click().catch(() => {}); await sleep(2000); }
const hdr2 = await page.evaluate(() => [...document.querySelectorAll('thead th')].map(t => t.innerText.trim()).filter(Boolean));
await shot('1324-01-list');
return done({ hdr, added, hdr2 });
