const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842';
const reqs = []; const on = r => { if (/\/api\/v1\//.test(r.url()) && r.request().method() !== 'GET') reqs.push(r.request().method() + ' ' + r.url().replace(/^.*\/api\/v1/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ':id') + ' ' + r.status()); };
page.on('response', on);
const t0 = Date.now();
await page.locator('button', { hasText: /^Save$/ }).first().click(); await sleep(1500);
let txt = (await page.innerText('body')).replace(/\s+/g, ' ');
if (/Save anyway/.test(txt)) { await shot('lb-save-confirm'); await page.locator('button', { hasText: 'Save anyway' }).click(); }
let ok = false;
for (let i = 0; i < 60; i++) { await sleep(1000); txt = (await page.innerText('body')).replace(/\s+/g, ' '); if (/saved|updated successfully/i.test(txt)) { ok = true; break; } if (/Failed|error|not saved/i.test(txt) && i > 2) break; }
const secs = (Date.now() - t0) / 1000;
await shot('lb-saved');
page.off('response', on);
const errs = (txt.match(/(Failed[^.]{0,120}|Layout not saved[^.]{0,200}|error[^.]{0,100})/gi) || []).slice(0, 5);
const g = await call('GET', `/modules/${M}/layouts/${L}`);
const secs2 = JSON.stringify(g.j.data.views.CREATE.layout).match(/qa_[a-z]+|[0-9a-f]{8}-[0-9a-f-]{27}/g);
return { ok, secs, reqs, errs, toast: (txt.match(/[^.]{0,60}(saved|updated successfully)[^.]{0,40}/i) || [''])[0], createViewHasFields: (secs2 || []).length, sample: JSON.stringify(g.j.data.views.CREATE.layout).slice(0, 600) };
