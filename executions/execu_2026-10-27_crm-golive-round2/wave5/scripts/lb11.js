const res = {};
await page.locator('button', { hasText: /^Delete Permanently$/ }).first().click(); await sleep(1500);
await shot('lb-after-delete');
const net = []; const on = x => { if (/\/api\/v1\//.test(x.url()) && x.request().method() !== 'GET') net.push(x.request().method() + ' ' + x.url().replace(/^.*\/api\/v1/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ':id') + ' ' + x.status()); }; page.on('response', on);
await page.locator('button', { hasText: /^Save$/ }).first().click(); await sleep(1500);
let txt = (await page.innerText('body')).replace(/\s+/g, ' ');
if (/Save anyway/.test(txt)) { res.saveConfirm = (txt.match(/[^|]{0,300}Save anyway/) || [''])[0].slice(-300); await shot('lb-delete-save-confirm'); await page.locator('button', { hasText: 'Save anyway' }).click(); }
for (let i = 0; i < 40; i++) { await sleep(1000); txt = (await page.innerText('body')).replace(/\s+/g, ' '); if (/saved successfully/i.test(txt) || /not saved|Failed/i.test(txt)) break; }
page.off('response', on); res.net = net;
res.msg = (txt.match(/[^.]{0,80}(saved successfully|not saved|Failed)[^.]{0,160}/i) || [''])[0];
await shot('lb-after-delete-save');
const fl = await call('GET', '/modules/b4848bdf-9f59-45a9-8336-9f4f2a4fc36b/fields'); res.fieldStillThere = JSON.stringify(fl.j).includes('lookup_contacts_r2w5');
return res;
