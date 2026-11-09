// Wave 2 helpers (appended after prelude). Every created object is pushed to CREATED.
const T='e8e5e302-3873-4e32-b945-c9cd25c7659d', CM='0bbb599e-013b-4465-a41e-85a324a4e3ac', DQ='9a7e391c-be72-49e4-a1cf-763e5c88e23d', ME='7017d261-36ee-4e2f-9e60-2310ece52ef8';
const CREATED = [];
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : { kind: 'string', value: String(v) };
const body = vals => ({ data: Object.entries(vals).map(([f, v]) => ({ field: f, value: enc(v) })) });
const fl = r => { const o = { id: r.id }; for (const x of (r.data || [])) { const v = x.value || {}; o[x.field] = v.kind === 'array' ? (v.items || []).map(i => i.value) : v.value !== undefined ? v.value : (v.kind === 'null' ? null : v); } return o; };
const mkRec = async (mod, vals, tag) => { const r = await api('POST', `/modules/${mod}/records`, body(vals)); const id = r.j && r.j.data && (r.j.data.id || (r.j.data.record && r.j.data.record.id)); if (id) CREATED.push({ k: mod === T ? 'ticket' : mod === CM ? 'contact' : mod, id, tag }); return { s: r.s, id, e: r.j && r.j.error, raw: r.t.slice(0, 300) }; };
const getRec = async (mod, id) => { const r = await api('GET', `/modules/${mod}/records/${id}`); return { s: r.s, o: r.j && r.j.data ? fl(r.j.data) : null }; };
const patchRec = async (mod, id, vals) => api('PATCH', `/modules/${mod}/records/${id}`, body(vals));
const short = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message).slice(0, 160) : undefined });
const fin = extra => done({ R, CREATED, ...(extra || {}) });
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
