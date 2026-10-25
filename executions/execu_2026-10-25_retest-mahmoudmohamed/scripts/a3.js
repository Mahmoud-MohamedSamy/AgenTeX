const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const names = () => page.evaluate(() => [...document.querySelectorAll('button, [role=combobox], select')].filter(e => { const r = e.getBoundingClientRect(); return r.top < 140 && r.width > 0; }).map(e => (e.getAttribute('aria-label') || '') + ' | ' + (e.innerText || '').trim().slice(0, 30)).filter(s => !/^ \| $/.test(s)));
await page.goto(H + `/modules/${L}?view=6f41abfa-3d8b-42fb-ab86-6fbf30f5bbf0`, { waitUntil: 'commit', timeout: 120000 });
await page.goto(H + `/modules/${L}`, { waitUntil: 'commit', timeout: 120000 });
for (let k = 0; k < 120; k++) { await sleep(1000); if (/سجل/.test(await txt().catch(() => '')) && !/لا توجد سجلات/.test(await txt())) break; }
await sleep(2000);
const t = await txt(); const out = { listCount: (t.match(/\n([^\n]*سجل[^\n]*)\n/) || [])[1], listHeader: await names(), englishLayout: [] };
await shot('2131-01-list-ar');
const cl = page.getByRole('button', { name: /إنشاء|Create/ }).first(); out.createBtn = await cl.innerText().catch(() => '?');
await cl.click(); await sleep(2000);
for (let k = 0; k < 60; k++) { await sleep(1000); if (/\/new|create/i.test(page.url())) break; }
await sleep(4000); out.createUrl = page.url().replace(H, ''); out.createHeader = await names();
out.layoutAria = await page.evaluate(() => [...document.querySelectorAll('[aria-label]')].map(e => e.getAttribute('aria-label')).filter(a => /layout|تخطيط/i.test(a)));
await shot('2131-02-create-ar');
return done(out);
