const dlg = async () => (await page.$$eval('[role=dialog], [role=menu], [data-state=open]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 900)))).filter(t => t && !t.startsWith('CRM New') && !t.startsWith('My Open'));
await page.locator('button:has-text("Cancel")').first().click().catch(() => {}); await sleep(800);
const row = page.locator('main tbody tr').first(); await row.hover(); await sleep(600);
const tb = await page.locator('main table').first().boundingBox();
out.tableLeft = tb && Math.round(tb.x); out.tableRight = tb && Math.round(tb.x + tb.width);
out.rowActions = await row.evaluate(r => [...r.querySelectorAll('button, [role=button]')].filter(e => e.offsetParent).map(e => ({ l: (e.getAttribute('aria-label') || e.title || e.innerText || '').trim().slice(0, 30), x: Math.round(e.getBoundingClientRect().left) })));
await page.screenshot({ path: RAW + 'wq-row-hover.png' });
const ra = page.locator('main tbody tr button[aria-label="Row actions"]').first(); if (await ra.count()) { await ra.click(); await sleep(700); out.rowMenu = await dlg(); await page.screenshot({ path: RAW + 'wq-row-menu.png' }); await page.keyboard.press('Escape'); await sleep(400); }
await page.locator('main button[aria-label="Filter"]').first().click({ timeout: 10000 }).catch(e => out.fErr = String(e.message).slice(0, 80)); await sleep(1500);
out.filterPanel = await dlg();
out.filterInputs = await page.$$eval('input', es => es.filter(e => e.offsetParent).map(e => e.placeholder || e.getAttribute('aria-label') || e.type));
await page.screenshot({ path: RAW + 'wq-queue-filter.png' });
