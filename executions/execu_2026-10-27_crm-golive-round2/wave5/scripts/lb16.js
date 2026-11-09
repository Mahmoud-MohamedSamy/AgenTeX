const res = {};
const panel = page.locator('xpath=//*[normalize-space(text())="Field Properties"]/ancestor::*[.//button[normalize-space(.)="Apply"]][1]').first();
const sw = panel.locator('button[role=switch]'); const n = await sw.count();
res.states = await sw.evaluateAll(b => b.map(x => x.getAttribute('aria-checked')));
const last = sw.nth(n - 1); if ((await last.getAttribute('aria-checked')) === 'true') await last.click(); await sleep(600);
res.regex = await panel.locator('input[placeholder^="e.g. ^[A-Z]"]').inputValue().catch(() => 'n/a');
await panel.locator('button', { hasText: /^Apply$/ }).click(); await sleep(1500);
const net = []; const on = x => { if (/\/api\/v1\//.test(x.url()) && x.request().method() !== 'GET') net.push(x.request().method() + ' ' + x.url().replace(/^.*\/api\/v1/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ':id') + ' ' + x.status() + ' ' + (x.request().postData() || '').slice(0, 160)); }; page.on('response', on);
await page.locator('button', { hasText: /^Save$/ }).first().click(); await sleep(1500);
let txt = (await page.innerText('body')).replace(/\s+/g, ' ');
if (/Save anyway/.test(txt)) { res.confirm = (txt.match(/[^|]{0,300}Save anyway/) || [''])[0].slice(-300); await page.locator('button', { hasText: 'Save anyway' }).click(); }
for (let i = 0; i < 60; i++) { await sleep(1000); txt = (await page.innerText('body')).replace(/\s+/g, ' '); if (/saved successfully/i.test(txt) || /not saved|Failed/i.test(txt)) break; }
page.off('response', on); res.net = net;
res.msg = (txt.match(/[^.]{0,40}(saved successfully|not saved|Failed)[^.]{0,160}/i) || [''])[0];
await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(7000);
const fl = await call('GET', '/modules/b4848bdf-9f59-45a9-8336-9f4f2a4fc36b/fields'); const arr = Array.isArray(fl.j.data) ? fl.j.data : fl.j.data.fields;
const pick = n => { const f = arr.find(x => x.apiName === n); return f ? JSON.stringify({ req: f.required ?? f.config?.required, uq: f.unique ?? f.config?.unique, rx: f.validation || f.config?.regex || f.datatypeOptions?.regex || f.config?.validation || null }).slice(0, 300) : 'missing'; };
res.email = pick('qa_email'); res.text = pick('qa_text');
res.textRaw = JSON.stringify(arr.find(x => x.apiName === 'qa_text')).slice(0, 900);
return res;
