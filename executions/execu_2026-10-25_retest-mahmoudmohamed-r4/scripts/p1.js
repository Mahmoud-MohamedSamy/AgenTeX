// NDC-1302: create a deal on a non-default pipeline and change pipeline — does the server keep it?
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', LS = 'fcba0068-d67f-44f5-8412-cdef9c09e16e';
const s = v => ({ kind: 'string', value: v });
const pl = await api('GET', `/modules/${D}/pipelines?layout_id=${LS}`); const P = arr(pl.j?.data).map(p => ({ id: p.id, name: p.name, def: p.is_default ?? p.isDefault, stages: (p.stages || []).map(x => x.stageValue).slice(0, 8) }));
const nonDef = P.find(p => !p.def && p.stages.length), def = P.find(p => p.def);
const pv = async id => Object.fromEntries(((await api('GET', `/modules/${D}/records/${id}`)).j?.data?.data || []).filter(x => /^(pipeline|stage)$/.test(x.field)).map(x => [x.field, x.value.value]));
const out = { pipelines: P.map(p => p.id.slice(0, 8) + ' ' + p.name + (p.def ? ' [default]' : '') + ' ' + p.stages.join('|')) };
if (nonDef) {
  const c = await api('POST', `/modules/${D}/records`, { layout_id: LS, data: [{ field: 'name', value: s('QA RT 1302 create') }, { field: 'deal_name', value: s('QA RT 1302 create') }, { field: 'pipeline', value: s(nonDef.id) }, { field: 'stage', value: s(nonDef.stages[0]) }] });
  out.create = { s: c.s, id: c.j?.data?.id, err: c.j?.error?.details?.[0]?.message || c.j?.error?.message, sent: nonDef.name + '/' + nonDef.stages[0] };
  if (c.j?.data?.id) out.create.stored = await pv(c.j.data.id);
  const c2 = await api('POST', `/modules/${D}/records`, { layout_id: LS, data: [{ field: 'name', value: s('QA RT 1302 move') }, { field: 'deal_name', value: s('QA RT 1302 move') }] });
  const id2 = c2.j?.data?.id; out.move = { created: c2.s, before: id2 && await pv(id2) };
  if (id2) { const p = await api('PATCH', `/modules/${D}/records/${id2}`, { data: [{ field: 'pipeline', value: s(nonDef.id) }, { field: 'stage', value: s(nonDef.stages[0]) }] }); out.move.patch = p.s + ' ' + (p.j?.error?.details?.[0]?.message || p.j?.error?.message || ''); out.move.after = await pv(id2); out.move.id = id2; }
  out.nonDefId = nonDef.id;
}
return done(out);
