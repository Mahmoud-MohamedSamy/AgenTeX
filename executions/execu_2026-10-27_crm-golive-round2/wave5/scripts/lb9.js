const res = {};
const f = page.locator('text=/^Lookup Contacts R2W5$/').first();
const b = await f.boundingBox();
await page.mouse.move(b.x + 50, b.y + 5); await sleep(600);
const btns = await page.$$('main button[aria-label="Field options"]'); let best = null, bd = 1e9;
for (const x of btns) { const bb = await x.boundingBox(); if (!bb) continue; const dy = Math.abs((bb.y + bb.height / 2) - (b.y + b.height / 2)), dx = bb.x - b.x; if (dy < 25 && dx > 0 && dx < 700 && dx < bd) { bd = dx; best = x; } }
await best.click(); await sleep(1000);
res.menu = await page.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || '));
await shot('lb-field-menu');
const del = page.locator('[role=menuitem]', { hasText: /Delete Permanently/i }).first();
if (await del.count()) {
  await del.click(); await sleep(1500);
  res.confirm = (await page.locator('[role=dialog], [role=alertdialog]').count()) ? (await page.locator('[role=dialog], [role=alertdialog]').first().innerText()).replace(/\s+/g, ' ').slice(0, 500) : 'no confirm';
  await shot('lb-delete-confirm');
  const c = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /Delete|Confirm|Yes/ }).first(); if (await c.count()) { await c.click(); await sleep(1500); }
}
const net = []; const on = x => { if (/\/api\/v1\//.test(x.url()) && x.request().method() !== 'GET') net.push(x.request().method() + ' ' + x.url().replace(/^.*\/api\/v1/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ':id') + ' ' + x.status()); }; page.on('response', on);
await page.locator('button', { hasText: /^Save$/ }).first().click(); await sleep(1500);
let txt = (await page.innerText('body')).replace(/\s+/g, ' ');
if (/Save anyway/.test(txt)) { res.saveConfirm = (txt.match(/[^.]{0,250}Save anyway/) || [''])[0]; await page.locator('button', { hasText: 'Save anyway' }).click(); }
for (let i = 0; i < 40; i++) { await sleep(1000); txt = (await page.innerText('body')).replace(/\s+/g, ' '); if (/saved successfully/i.test(txt) || /not saved|Failed/i.test(txt)) break; }
page.off('response', on); res.net = net;
res.msg = (txt.match(/[^.]{0,80}(saved successfully|not saved|Failed)[^.]{0,160}/i) || [''])[0];
await shot('lb-after-delete-save');
const fl = await call('GET', '/modules/b4848bdf-9f59-45a9-8336-9f4f2a4fc36b/fields'); res.fieldStillThere = fl.t.includes('lookup_contacts_r2w5') || JSON.stringify(fl.j).includes('lookup_contacts_r2w5');
return res;
