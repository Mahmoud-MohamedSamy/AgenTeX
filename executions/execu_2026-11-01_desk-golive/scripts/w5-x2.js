const m = page.locator('main').last();
await m.getByRole('button', { name: 'Module', exact: true }).first().click(); await sleep(1200); await page.getByRole('option', { name: /^Contacts$/ }).first().click(); await sleep(2000);
await m.getByRole('button', { name: 'Records', exact: true }).click(); await sleep(1500);
out.views = (await page.locator('[role=listbox]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
await page.getByRole('option', { name: /QA GL W5 view/ }).first().click().catch(e => out.vErr = e.message.slice(0, 60)); await sleep(1500);
const dl = page.waitForEvent('download', { timeout: 60000 }).catch(() => null);
const n0 = NET.length; await m.getByRole('button', { name: /^Export$/ }).last().click(); const f = await dl;
if (f) { const p = RUN + '/wave5/raw/W5-39-' + f.suggestedFilename(); await f.saveAs(p); out.file = f.suggestedFilename(); out.content = require('fs') ? '' : ''; }
await sleep(4000); out.net = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 150));
const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.hist = t.slice(t.indexOf('Any status') + 10, t.indexOf('Any status') + 300); await shot('w5/W5-39-done');
return fin({ out });
