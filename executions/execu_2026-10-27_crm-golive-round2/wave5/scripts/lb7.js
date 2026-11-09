const res = {};
const panel = page.locator('xpath=//*[normalize-space(text())="Field Properties"]/ancestor::*[.//button[normalize-space(.)="Apply"]][1]').first();
await panel.locator('button, [role=tab]', { hasText: /^ADVANCED$/ }).first().click(); await sleep(1000);
const sels = panel.locator('select');
res.mods = await sels.nth(0).evaluate(s => [...s.options].map(o => o.text));
await sels.nth(0).selectOption({ label: 'QA R2W5 Child' }); await sleep(800);
await panel.locator('input[placeholder="e.g. Deals"]').fill('QA R2W5 lookups');
await panel.locator('button', { hasText: /^Apply$/ }).click(); await sleep(1500);
const net = []; const on = x => { if (/\/api\/v1\//.test(x.url()) && x.request().method() !== 'GET') net.push(x.request().method() + ' ' + x.url().replace(/^.*\/api\/v1/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ':id') + ' ' + x.status()); }; page.on('response', on);
const t0 = Date.now();
await page.locator('button', { hasText: /^Save$/ }).first().click(); await sleep(1500);
let txt = (await page.innerText('body')).replace(/\s+/g, ' ');
if (/Save anyway/.test(txt)) { res.confirm = (txt.match(/[^.]{0,200}Save anyway/) || [''])[0]; await page.locator('button', { hasText: 'Save anyway' }).click(); }
for (let i = 0; i < 60; i++) { await sleep(1000); txt = (await page.innerText('body')).replace(/\s+/g, ' '); if (/saved successfully/i.test(txt) || /not saved|Failed/i.test(txt)) break; }
res.secs = (Date.now() - t0) / 1000; page.off('response', on); res.net = net;
res.msg = (txt.match(/[^.]{0,80}(saved successfully|not saved|Failed)[^.]{0,120}/i) || [''])[0];
await shot('lb-lookup-saved');
return res;
