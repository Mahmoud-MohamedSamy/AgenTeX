const D = MODS.deals, R = '38c799e2-bb59-433d-a96d-7e70472c3a1b', out = {};
const v = async () => { const g = await call('GET', `/modules/${D}/records/${R}`); const d = g.j.data.data; const f = k => ((d.find(e => e.field === k) || {}).value || {}).value; return f('pipeline') + ' / ' + f('stage'); };
out.created = await v();
const p = await call('GET', `/modules/${D}/pipelines/640e03a4-0000-0000-0000-000000000000`);
const pl = await call('GET', `/modules/${D}/pipelines?layout_id=fcba0068-d67f-44f5-8412-cdef9c09e16e`);
const p1 = (pl.j.data || []).find(x => x.name === '1'); out.p1 = p1 && (p1.id + ' stages ' + (p1.stages || []).map(s => s.value || s.name || s.stage).join(','));
const s = (k, val) => ({ field: k, value: { kind: 'string', value: val } });
for (const val of [p1.id, '1', '1 (Standard)']) { const r = await call('PATCH', `/modules/${D}/records/${R}`, { data: [s('pipeline', val), s('stage', ((p1.stages || [])[0] || {}).value || 'qualification')] }); out['patch ' + val.slice(0, 12)] = r.s + ' ' + (r.s < 300 ? '' : r.t.slice(0, 160)) + ' -> ' + await v(); }
return out;
