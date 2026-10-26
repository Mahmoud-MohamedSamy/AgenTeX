const TS = 'c7bb126d-0c55-489f-8924-5fd6f2a98507';
const open = async () => { await page.goto(H + '/settings/teamspace', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/QA RT TS/.test(await txt().catch(() => ''))) break; } await sleep(800); await page.getByText('QA RT TS', { exact: true }).first().click(); await sleep(3000); };
await open();
const exp = async () => { const vis = await page.evaluate(() => [...document.querySelectorAll('*')].some(e => e.childElementCount === 0 && e.textContent.trim() === 'calls' && e.offsetParent)); if (!vis) { await page.getByText('QA RT Folder A2', { exact: true }).first().click(); await sleep(1000); } };
await exp();
const r = await page.evaluate(() => { const el = [...document.querySelectorAll('*')].filter(e => e.childElementCount === 0 && e.textContent.trim() === 'calls').pop(); let c = el; for (let k = 0; k < 5; k++) { c = c.parentElement; const b = c.querySelector('button'); if (b) { const x = b.getBoundingClientRect(); return { x: x.x + x.width / 2, y: x.y + x.height / 2, label: b.getAttribute('aria-label') || b.title || '' }; } } });
await page.mouse.move(r.x, r.y); await shot('1698-01-x-on-folder-module'); await page.mouse.click(r.x, r.y); await sleep(1200);
const dlg = await page.evaluate(() => document.querySelector('[role=dialog],[role=alertdialog]')?.innerText.slice(0, 200) || null);
if (dlg) { const c = page.getByRole('button', { name: /Remove|Delete|Confirm|Yes/ }).last(); await c.click().catch(() => {}); await sleep(800); }
const cardBefore = (await txt()).match(/QA RT Folder A2[\s\S]{0,120}/)?.[0];
await page.getByRole('button', { name: 'Save', exact: true }).last().click(); await sleep(3500);
await open(); await exp(); const cardAfter = (await txt()).match(/QA RT Folder A2[\s\S]{0,150}/)?.[0];
const mods = arr((await api('GET', `/teamspaces/${TS}/modules`)).j?.data).map(x => (x.moduleKey || x.name) + ' folder=' + String(x.folderId || '-').slice(0, 8));
await shot('1698-02-after-save');
return done({ xLabel: r.label, dlg, cardBefore, cardAfter, mods });
