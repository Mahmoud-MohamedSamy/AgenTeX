await page.getByPlaceholder('Untitled Teamspace').fill('QA RT TS'); await sleep(600);
await page.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 5 && /auto|scroll/.test(getComputedStyle(e).overflowY)) e.scrollTop = 99999; })); await sleep(600);
const save = page.getByRole('button', { name: /^Save/ }).last();
const out = { saveEnabled: await save.isEnabled().catch(() => null), saveTitle: await save.getAttribute('title').catch(() => null) };
out.hints = (await txt()).split('\n').filter(l => /module/i.test(l)).slice(0, 8);
await shot('1694-02-empty-save');
const resp = []; const fr = async r => { const q = r.request(); if (q.method() !== 'GET' && /teamspace/.test(q.url())) resp.push(q.method() + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 200)); }; page.on('response', fr);
if (out.saveEnabled) { await save.click(); await sleep(3500); }
page.off('response', fr); out.resp = resp; out.toasts = await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText.trim()));
out.inline = (await txt()).split('\n').filter(l => /at least|add a module|required|module/i.test(l)).slice(0, 6); out.url = page.url().replace(H, '');
await shot('1694-03-after-save');
return done(out);
