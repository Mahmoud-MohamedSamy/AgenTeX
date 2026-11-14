const m = page.locator('main').last();
await m.locator('input[value=custom]').check(); await sleep(800);
out.types = await m.locator('input[aria-label=From], input[aria-label=To], input[name=from], input[name=to]').evaluateAll(es => es.map(e => e.type + ' ' + (e.getAttribute('aria-label') || e.name) + '=' + e.value));
const from = m.getByLabel('From', { exact: true }), to = m.getByLabel('To', { exact: true });
await from.fill('2026-11-13').catch(async () => await from.fill('13/11/2026')); await to.fill('2026-11-13').catch(async () => await to.fill('13/11/2026')); await sleep(800);
out.vals = [await from.inputValue().catch(() => '?'), await to.inputValue().catch(() => '?')];
const n0 = NET.length; await m.getByRole('button', { name: 'Back Up Now' }).click(); await sleep(3000);
const cd = page.locator('[role=alertdialog], [role=dialog]').last(); if (await cd.count()) { out.conf = (await cd.innerText()).replace(/\s+/g, ' ').slice(0, 300); await shot('w5/W5-41-confirm'); const b = cd.getByRole('button', { name: /Back Up|Start|Confirm|Continue/ }).last(); if (await b.count()) await b.click(); await sleep(4000); }
out.net = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.b.slice(0, 150) + ' => ' + x.t.slice(0, 200));
for (let i = 0; i < 12; i++) { await sleep(5000); await m.getByRole('button', { name: 'Refresh' }).last().click().catch(() => {}); const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.logs = t.slice(t.indexOf('Backup logs'), t.indexOf('Backup logs') + 700); if (/Completed|Ready|Failed/.test(out.logs)) break; }
await shot('w5/W5-41-logs');
return fin({ out });
