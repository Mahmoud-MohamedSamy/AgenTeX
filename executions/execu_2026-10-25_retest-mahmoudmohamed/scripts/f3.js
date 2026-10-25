const btn = page.locator('button[aria-label="Field options"]').filter({ has: page.locator('xx') }).first();
const opt = await page.evaluateHandle(() => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'QA RT Temp Number'); let c = el; for (let k = 0; k < 6; k++) { c = c.parentElement; if (c.querySelector('button[aria-label="Field options"]')) return c.querySelector('button[aria-label="Field options"]'); } });
await opt.asElement().click(); await sleep(900);
const items = await page.evaluate(() => [...document.querySelectorAll('[role=menuitem]')].map(e => e.innerText.trim()));
await shot('2106-02-field-menu');
const del = page.getByRole('menuitem', { name: /Delete/i }).first();
let dialog = null;
if (await del.count()) { await del.click(); await sleep(2500); dialog = await page.evaluate(() => { const d = document.querySelector('[role=alertdialog], [role=dialog]'); return d ? d.innerText.slice(0, 1200) : null; }); await shot('2106-03-delete-dialog'); }
return done({ items, dialog });
