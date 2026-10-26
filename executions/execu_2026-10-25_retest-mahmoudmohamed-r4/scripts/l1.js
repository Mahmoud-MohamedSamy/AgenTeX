// NDC-1335: layout "test" → toggle Module Image → Save; capture writes, errors, toasts; then Cancel → no unsaved prompt.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
await page.goto(H + `/settings/modules-and-fields/${L}/layouts/${LT}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); if ((await txt().catch(() => '')).includes('isTrue')) break; } await sleep(3000); await shot('1335-00-loaded');
const sw = page.getByRole('switch').first(); const was = await sw.getAttribute('aria-checked'); await sw.click(); await sleep(800);
const resp = []; const fr = async r => { const q = r.request(); if (q.method() !== 'GET' && /\/api\/v1\/(modules|layouts|fields)/.test(q.url())) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 95) + ' ' + r.status() + (r.status() >= 300 ? ' ' + (await r.text().catch(() => '')).slice(0, 140) : '')); }; page.on('response', fr);
const toasts = new Set(); const t0 = Date.now(); await page.getByRole('button', { name: 'Save', exact: true }).click();
for (let k = 0; k < 45; k++) { await sleep(1000); for (const x of await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast], [role=alert]')].map(x => x.innerText.trim()).filter(Boolean))) toasts.add(x); if ([...toasts].some(x => /saved|fail|error/i.test(x)) && k > 4) break; }
page.off('response', fr); await shot('1335-02-after-save-loaded');
const secs = Math.round((Date.now() - t0) / 1000);
await page.getByRole('button', { name: 'Cancel', exact: true }).click(); await sleep(1500);
const prompt = await page.evaluate(() => document.querySelector('[role=alertdialog],[role=dialog]')?.innerText.slice(0, 200) || null);
const lay = (await api('GET', `/modules/${L}/layouts/${LT}`)).j?.data; const img = JSON.stringify(lay).match(/"(moduleImage|module_image|showModuleImage)[^,]*/)?.[0];
return done({ was, secs, resp, toasts: [...toasts], prompt, url: page.url().replace(H, ''), stored: img });
