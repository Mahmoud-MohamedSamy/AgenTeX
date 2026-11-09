const dlg = async () => (await page.$$eval('[role=dialog], [role=menu], [data-state=open]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 700)))).filter(t => t && !t.startsWith('CRM New') && !t.startsWith('My Open'));
const t0 = Date.now();
for (let i = 0; i < 90; i++) { await sleep(1000); if (await page.locator('main tbody tr td').count() > 3) break; }
out.queueRowsSec = (Date.now() - t0) / 1000;
out.queueText = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 700);
await page.screenshot({ path: RAW + 'wq-queue-rows.png' });
out.allButtons = await page.$$eval('main button', es => es.map(e => (e.getAttribute('aria-label') || e.getAttribute('title') || e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 30)).filter(Boolean)).then(a => [...new Set(a)]);
await page.locator('main button[aria-label^="Column options"]').first().click().catch(e => out.cmErr = String(e.message).slice(0, 80)); await sleep(800);
out.columnMenu = await dlg(); await page.screenshot({ path: RAW + 'wq-queue-colmenu.png' }); await page.keyboard.press('Escape'); await sleep(400);
// row hover: where are row actions
const row = page.locator('main tbody tr').first(); await row.hover(); await sleep(600);
out.rowActions = await row.$$eval('button, [role=button]', es => es.filter(e => e.offsetParent).map(e => ({ l: (e.getAttribute('aria-label') || e.title || e.innerText || '').trim().slice(0, 30), x: Math.round(e.getBoundingClientRect().left) })));
await page.screenshot({ path: RAW + 'wq-row-hover.png' });
// filter: the funnel icon in the queue header
const f = page.locator('main button[aria-label*="ilter"], main button[title*="ilter"]').first();
out.filterBtn = await f.count();
if (out.filterBtn) { await f.click(); await sleep(1500); out.filterPanel = await dlg(); await page.screenshot({ path: RAW + 'wq-queue-filter.png' }); }
out.alphabet = await page.$$eval('main button', es => es.map(e => e.innerText.trim()).filter(t => /^([A-Z]|All|#)$/.test(t))).then(a => a.join(' '));
