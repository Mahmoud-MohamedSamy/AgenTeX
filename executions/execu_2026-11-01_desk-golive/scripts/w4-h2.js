await go('/settings/organization/customer-happiness', 10000);
const tx = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ');
const i = tx.indexOf('Ticket Closed email'); out.closed = tx.slice(i, i + 700);
const j = tx.indexOf('To add a language'); out.tr = tx.slice(j - 300, j + 120);
// download English
const sel = page.locator('main select').filter({ hasText: 'Chinese' }).first(); out.selCount = await sel.count();
const dlP = page.waitForEvent('download', { timeout: 20000 }).catch(e => null);
await page.getByRole('button', { name: 'Download file' }).first().click(); const dl = await dlP;
if (dl) { const p = RUN + '/wave4/raw/W4-79-' + dl.suggestedFilename(); await dl.saveAs(p); out.file = dl.suggestedFilename(); }
else { out.noDl = true; out.dlg = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); }
await shot('w4/W4-79-download');
return fin({ out });
