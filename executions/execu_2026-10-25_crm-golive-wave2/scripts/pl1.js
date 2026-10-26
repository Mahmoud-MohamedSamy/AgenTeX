const D = MODS.deals, out = {};
const ls = await call('GET', `/modules/${D}/layouts`); const lays = ls.j.data.layouts || ls.j.data;
for (const l of lays) { const p = await call('GET', `/modules/${D}/pipelines?layout_id=${l.id}`); out[l.name + ' ' + l.id.slice(0, 8)] = p.s === 200 ? (p.j.data || []).map(x => x.name + '|' + x.id.slice(0, 8) + '|def=' + x.isDefault + '|stages=' + (x.stages || []).length) : p.s + ' ' + p.t.slice(0, 100); }
const f = await call('GET', `/modules/${D}/fields`); const pf = (f.j.data.fields || f.j.data).find(x => x.apiName === 'pipeline');
out.pipelineField = JSON.stringify(pf.datatypeOptions).slice(0, 400);
const s = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const L = 'fcba0068-d67f-44f5-8412-cdef9c09e16e';
const tries = {};
for (const pv of ['5170500c-b335-479c-96d1-ed138965c345', 'Standard', 'Standard (Standard)']) { const r = await call('POST', `/modules/${D}/records`, { layout_id: L, data: [s('name', 'QA W2 PL ' + pv.slice(0, 8)), s('deal_name', 'QA W2 PL ' + pv.slice(0, 8)), s('pipeline', pv), s('stage', 'qualification')] }); tries[pv] = r.s + ' ' + (r.s < 300 ? r.j.data.id : r.t.slice(0, 200)); }
out.create = tries;
return out;
