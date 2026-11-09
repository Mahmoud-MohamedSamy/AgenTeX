const dlg = async () => (await page.$$eval('[role=dialog], [role=menu], [role=listbox], aside[aria-label], [data-state=open]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 700)))).filter(Boolean);
await page.click('button[aria-label="EveryLeadWithNoAnswerStatus, 5 records"]'); await sleep(5000);
out.queueText = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 900);
out.queueButtons = await page.$$eval('main button', es => es.map(e => (e.getAttribute('aria-label') || e.getAttribute('title') || e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40)).filter(Boolean));
await page.screenshot({ path: RAW + 'wq-queue.png' });
// column options menu
await page.locator('main button[aria-label^="Column options"]').first().click(); await sleep(800);
out.columnMenu = await dlg(); await page.screenshot({ path: RAW + 'wq-column-menu.png' }); await page.keyboard.press('Escape'); await sleep(500);
// table settings
await page.click('main button[aria-label="Table settings"]'); await sleep(800);
out.tableSettings = await dlg(); await page.screenshot({ path: RAW + 'wq-table-settings.png' });
const mc = page.locator('[role=menuitem]:has-text("Manage Columns"), button:has-text("Manage Columns")').first();
if (await mc.count()) { await mc.click(); await sleep(1500); out.manageColumns = await dlg(); out.mcInputs = await page.$$eval('[role=dialog] input', es => es.map(e => e.type + ':' + (e.placeholder || e.getAttribute('aria-label') || ''))); out.mcButtons = await page.$$eval('[role=dialog] button', es => es.map(e => (e.getAttribute('aria-label') || e.getAttribute('title') || e.innerText || '').trim().slice(0, 30)).filter(Boolean)).then(a => [...new Set(a)].slice(0, 40));
  const s = page.locator('[role=dialog] input[type=search], [role=dialog] input[type=text]').first();
  if (await s.count()) { await s.fill('Pho'); await sleep(600); out.mcClear = await page.$$eval('[role=dialog] button', es => es.some(e => /clear/i.test(e.getAttribute('aria-label') || e.title || ''))); }
  await page.screenshot({ path: RAW + 'wq-manage-columns.png' }); await page.keyboard.press('Escape'); await sleep(600); }
else await page.keyboard.press('Escape');
// filter panel
await page.click('main button[aria-label="Filter"]'); await sleep(1500);
out.filterPanel = await dlg(); out.filterText = (await page.innerText('body')).match(/(System Defined|Filter By Fields|Filter By Related)[^]{0,300}/)?.[0]?.replace(/\s+/g, ' ');
await page.screenshot({ path: RAW + 'wq-filter.png' });
const fs = page.locator('input[placeholder*="Search"]').last(); if (await fs.count()) { await fs.fill('Lead'); await sleep(600); out.filterClear = await page.$$eval('button', es => es.some(e => /clear/i.test(e.getAttribute('aria-label') || e.title || '') && e.offsetParent)); }
await page.keyboard.press('Escape');
// alphabet filter
out.alphabet = await page.$$eval('main button', es => es.map(e => e.innerText.trim()).filter(t => /^([A-Z]|All|#)$/.test(t))).then(a => a.join(' '));
