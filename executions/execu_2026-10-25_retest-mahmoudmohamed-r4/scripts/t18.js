const TS = 'c7bb126d-0c55-489f-8924-5fd6f2a98507';
const open = async () => { await page.goto(H + '/settings/teamspace', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/QA RT TS/.test(await txt().catch(() => ''))) break; } await sleep(800); await page.getByText('QA RT TS', { exact: true }).first().click(); await sleep(3000); };
const fA = page.getByText('QA RT Folder A', { exact: true }).first(); await fA.dblclick(); await sleep(800);
let inp = page.locator('input[value="QA RT Folder A"]'); const editable = await inp.count();
if (!editable) { await fA.hover(); const btns = await page.evaluate(() => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'QA RT Folder A'); let c = el; for (let k = 0; k < 5; k++) { c = c.parentElement; if (c.querySelectorAll('button').length > 1) break; } return [...c.querySelectorAll('button')].map(b => b.getAttribute('aria-label') || b.title || b.innerText.trim()); }); return done({ editable, btns }); }
await inp.fill('QA RT Folder A2'); await page.keyboard.press('Enter'); await sleep(600);
const resp = []; const fr = async r => { const q = r.request(); if (q.method() !== 'GET' && /teamspace/.test(q.url())) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 70) + ' ' + r.status()); }; page.on('response', fr);
await page.getByRole('button', { name: 'Save', exact: true }).last().click(); await sleep(3500); page.off('response', fr);
const toasts = await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText.trim()));
await open(); const card = (await txt()).match(/QA RT Folder A2?/g);
const api1 = arr((await api('GET', `/teamspaces/${TS}/folders`)).j?.data).map(x => x.name);
await shot('1695-01-after-reload');
return done({ resp, toasts, card, api1 });
