const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.keyboard.press('Escape'); await sleep(300);
const resp = []; const fr = async r => { const q = r.request(); if (q.method() !== 'GET' && /\/api\/v1\/(modules|layouts|fields)/.test(q.url())) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 95) + ' ' + r.status() + (r.status() >= 300 ? ' ' + (await r.text().catch(() => '')).slice(0, 200) : '')); }; page.on('response', fr);
const toasts = new Set(); const t0 = Date.now(); await page.getByRole('button', { name: 'Save', exact: true }).click();
for (let k = 0; k < 45; k++) { await sleep(1000); for (const x of await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast], [role=alert]')].map(x => x.innerText.trim()).filter(Boolean))) toasts.add(x); if ([...toasts].some(x => /saved|created|fail|error|exists/i.test(x)) && k > 3) break; }
page.off('response', fr); await shot('1335-05-new-saved');
const ls = arr((await api('GET', `/modules/${L}/layouts`)).j?.data).filter(x => /Standard Layout|QA RT/.test(x.name)).map(x => x.id + ' ' + x.name + ' ' + (x.createdAt || ''));
return done({ secs: Math.round((Date.now() - t0) / 1000), resp, toasts: [...toasts], url: page.url().replace(H, ''), ls });
