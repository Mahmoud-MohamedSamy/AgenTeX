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
const o = {}; const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 260) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 300) : undefined });
const D2 = 'ca81f7da-cd75-49e3-953a-43d120bd43c2';
o.tag = sh(await api('DELETE', '/desk/tags/80f2da0d-b632-4eb2-b85d-7313344c7b32', { confirm: true }));
o.dept = sh(await api('DELETE', `/desk/departments/${D2}`, { transfer_to_department_id: DQ }));
const bi = await api('GET', '/audit/recycle-bin/items?limit=50&app=desk'); const items = arr(bi.j && bi.j.data);
const base = items.find(i => i.record_id === '3008a52d-6f69-48bb-90ba-bac134c7aa56'); o.baseItem = base && base.id;
if (base) { const df = await api('POST', '/audit/recycle-bin/delete', { item_ids: [base.id] }); o.deleteForever = sh(df); const bi2 = await api('GET', '/audit/recycle-bin/items?limit=50&app=desk'); o.stillInBin = arr(bi2.j && bi2.j.data).some(i => i.id === base.id); }
const dl = await api('GET', '/desk/departments'); o.deptsNow = arr(dl.j && dl.j.data).map(d => d.name);
return done(o);
