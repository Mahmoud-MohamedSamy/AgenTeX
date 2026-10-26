// API checks 2402, 2401, 2397, 2396, 2398, 2409. Restores config at the end.
const B = '/desk/integrations/crm'; const out = {};
const rnd = '3f1c2a9e-0000-4000-8000-00000000abcd';
out.n2402 = { stats: (await api('GET', `${B}/customers/contact/${rnd}/stats?months=6`)).s, info: (await api('GET', `${B}/context/contact/${rnd}/info`)).s };
const p = await api('POST', `${B}/pause`, { reason: 'QA RT ' + 'x'.repeat(1200) }); out.n2401 = p.s + ' ' + p.t.slice(0, 220);
const st1 = (await api('GET', `${B}/status`)).j?.data?.paused; out.n2401paused = st1; if (st1) out.n2401resume = (await api('POST', `${B}/resume`, {})).s;
const base = (await api('GET', `${B}/config`)).j.data; const orig = JSON.parse(JSON.stringify(base));
const strip = c => { const b = JSON.parse(JSON.stringify(c)); delete b.status; return b; };
// 2397: no row_version
{ const b = strip(base); delete b.row_version; b.calls_enabled = !base.calls_enabled; const r = await api('PUT', `${B}/config`, b); out.n2397 = r.s + ' ' + r.t.slice(0, 220); }
// 2396: invalid mappings
const cases = [{ crm_field: 'no_such_field_qa', desk_field: 'description' }, { crm_field: 'description', desk_field: 'no_such_field_qa' }, { crm_field: 'account_id', desk_field: 'description' }, { crm_field: '', desk_field: 'description' }];
out.n2396 = [];
for (const m of cases) { const cur = (await api('GET', `${B}/config`)).j.data; const b = strip(cur); b.contacts = { ...b.contacts, mappings: [...(b.contacts?.mappings || []), m] }; const r = await api('PUT', `${B}/config`, b); out.n2396.push(JSON.stringify(m) + ' → ' + r.s + ' ' + (r.j?.error?.code || '') + ' ' + JSON.stringify(r.j?.error?.details || '').slice(0, 160)); }
// restore
{ const cur = (await api('GET', `${B}/config`)).j.data; const b = strip(orig); b.row_version = cur.row_version; const r = await api('PUT', `${B}/config`, b); out.restore = r.s; const after = strip((await api('GET', `${B}/config`)).j.data); delete after.row_version; const o2 = strip(orig); delete o2.row_version; out.restoredEqual = JSON.stringify(after) === JSON.stringify(o2); }
const h = await api('GET', `${B}/history?days=7`); out.n2398 = h.s + ' rows=' + arr(h.j?.data).length + ' keys=' + Object.keys(arr(h.j?.data)[0] || {}).join(',') + ' sample=' + JSON.stringify(arr(h.j?.data)[0]);
const ev = await api('GET', '/audit/events?limit=100'); const evs = arr(ev.j?.data); out.n2409 = ev.s + ' n=' + evs.length + ' integration=' + evs.filter(e => /integration|crm_sync|desk.integ/i.test(JSON.stringify(e))).slice(0, 3).map(e => JSON.stringify(e).slice(0, 200)).join(' || ');
return done(out);
