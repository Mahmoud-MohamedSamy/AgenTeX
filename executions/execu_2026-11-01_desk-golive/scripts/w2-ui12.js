const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const main = async () => (await page.$eval('main', m => m.innerText).catch(() => '')).replace(/\s+/g, ' ');
// custom view via API (list type)
const vc = await api('POST', `/modules/${T}/views`, { name: 'QA GL W2 view', type: 'list', view_type: 'table', criteria: { op: 'eq', field: 'department', value: DQ }, columns: ['subject', 'status', 'priority'], settings: { categorize_field: 'status' } });
o.viewCreate = vc.s + ' ' + (vc.j && vc.j.error ? vc.j.error.message + ' ' + JSON.stringify(vc.j.error.details || '').slice(0, 150) : ''); const vid = vc.j && vc.j.data && vc.j.data.id;
if (vid) { CREATED.push({ k: 'view', id: vid }); o.pin = (await api('PUT', `/modules/${T}/views/${vid}/pin`, {})).s; o.unpin = (await api('DELETE', `/modules/${T}/views/${vid}/pin`)).s; const cl = await api('POST', `/modules/${T}/views/${vid}/clone`, { name: 'QA GL W2 view clone' }); o.clone = cl.s; const cid = cl.j && cl.j.data && cl.j.data.id; if (cid) o.cloneDel = (await api('DELETE', `/modules/${T}/views/${cid}`)).s; o.del = (await api('DELETE', `/modules/${T}/views/${vid}`)).s; }
// modes
await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/All Tickets \(\d/, 40);
const cv = page.locator('button', { hasText: /Classic View|Table View|Compact|Board/ }).first(); if (await cv.count()) { await cv.click().catch(() => {}); await sleep(1500); o.modes = await page.$$eval('[role=menuitem], [role=option], [role=menuitemradio]', m => m.map(x => x.innerText.trim()).filter(Boolean)); await page.keyboard.press('Escape'); }
// rail pages
for (const [k, name] of [['agentQ', 'Agent Queue'], ['teamQ', 'Team Queue'], ['tags', 'Tags']]) { const l = page.locator('nav a, aside a, a', { hasText: new RegExp('^' + name + '$') }).first(); if (await l.count()) { await l.click().catch(() => {}); await sleep(9000); o[k] = page.url().replace(H, '') + ' :: ' + (await main()).slice(0, 380); } else o[k] = 'link not found'; }
return fin(o);
