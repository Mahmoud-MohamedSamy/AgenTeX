const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = { reqs: [] };
page.on('request', r => { if (/records\/export/.test(r.url())) out.reqs.push(r.method() + ' ' + decodeURIComponent(r.url().replace(API, ''))); });
await page.setViewportSize({ width: 1600, height: 900 }); await go(`/modules/${L}`, 6000); for (let j = 0; j < 60 && !/records/.test(await txt()); j++) await sleep(2000); await sleep(3000);
out.layout = await page.locator('select').first().evaluate(e => e.options[e.selectedIndex].text).catch(() => '?');
const more = page.locator('button').filter({ hasText: /^$/ }); const cb = await page.getByRole('button', { name: /^Create / }).first().boundingBox(); await page.mouse.click(cb.x - 22, cb.y + cb.height / 2); await sleep(1500);
out.menu = (await page.locator('[role=menuitem]').allInnerTexts()).slice(0, 16);
await page.locator('[role=menuitem]').filter({ hasText: /^Export/ }).first().click(); await sleep(3000); await shot('v38-export-dialog');
out.dialog = (await txt()).split('\n').map(l => l.trim()).filter(l => /field|Field|column|Column|Current page|All records|CSV|Excel|Every/i.test(l)).slice(0, 16);
const allf = page.getByText(/^All fields$/).first(); if (await allf.count()) { await allf.click(); await sleep(800); }
out.help = (await txt()).split('\n').map(l => l.trim()).filter(l => /Every field|layout|Record ID/i.test(l)).slice(0, 4);
await shot('v38-export-allfields');
const dl = page.waitForEvent('download', { timeout: 60000 }).catch(() => null); await page.getByRole('button', { name: /^Export$/ }).last().click(); const d = await dl;
if (d) { const p = SHOT + '/../export-allfields' + (d.suggestedFilename().match(/\.\w+$/) || ['.bin'])[0]; await d.saveAs(p); out.file = d.suggestedFilename(); }
await sleep(3000); return done(out);
