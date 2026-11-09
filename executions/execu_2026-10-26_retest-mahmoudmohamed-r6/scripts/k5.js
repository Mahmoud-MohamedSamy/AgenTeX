// NDC-2382 with the custom 'pipeline' pick list temporarily widened; always restored to the original allowed_values.
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', F = '6b44c7c9-5c6b-4e7f-a33a-5fdbc43ec0ab', LT = 'fcba0068-d67f-44f5-8412-cdef9c09e16e';
const P1 = '640e03a4-9c24-4b06-8d7d-5c1db2711b9b', STD = '5170500c-b335-479c-96d1-ed138965c345';
const s = v => ({ kind: 'string', value: v }); const out = { ids: [] };
const getF = async () => arr((await api('GET', `/modules/${D}/fields`)).j?.data).find(x => x.id === F);
const orig = await getF(); const origAV = orig.config.allowed_values;
const read = async id => { const g = (await api('GET', `/modules/${D}/records/${id}`)).j?.data; const o = {}; for (const x of g?.data || []) if (/pipeline|stage/.test(x.field)) o[x.field] = x.value?.value; return o; };
try {
  const av = [...origAV, P1, STD];
  const w = await api('PUT', `/modules/${D}/fields/${F}`, { ...orig, datatypeOptions: { ...orig.datatypeOptions, allowed_values: av }, config: { ...orig.config, allowed_values: av } });
  out.widen = w.s + ' ' + (w.s >= 300 ? w.t.slice(0, 200) : '');
  if (w.s < 300) {
    const st1 = (await api('GET', `/modules/${D}/pipelines?layout_id=${LT}`)).j?.data?.find(p => p.id === P1)?.stages?.map(x => x.stageValue) || [];
    out.p1Stages = st1;
    const c = await api('POST', `/modules/${D}/records`, { layout_id: LT, data: [{ field: 'deal_name', value: s('QA RT 2382 on pipeline 1') }, { field: 'pipeline', value: s(P1) }, { field: 'stage', value: s(st1[0]) }] });
    out.createP1 = c.s + ' ' + (c.s >= 300 ? (c.j?.error?.message || c.t).slice(0, 200) : ''); if (c.j?.data?.id) { out.ids.push(c.j.data.id); out.createdRead = await read(c.j.data.id); }
    const d = await api('POST', `/modules/${D}/records`, { layout_id: LT, data: [{ field: 'deal_name', value: s('QA RT 2382 move me') }] }); const did = d.j?.data?.id; if (did) out.ids.push(did);
    if (did) { out.before = await read(did); const m = await api('PATCH', `/modules/${D}/records/${did}`, { data: [{ field: 'pipeline', value: s(P1) }, { field: 'stage', value: s(st1[0]) }] }); out.move = m.s + ' ' + (m.s >= 300 ? (m.j?.error?.message || m.t).slice(0, 200) : ''); out.after = await read(did);
      const bad = await api('PATCH', `/modules/${D}/records/${did}`, { data: [{ field: 'stage', value: s('closed_won') }] }); out.stageNotInP1 = bad.s + ' ' + (bad.j?.error?.message || '').slice(0, 160) + ' (P1 has closed_won: ' + st1.includes('closed_won') + ')'; }
  }
} finally {
  const cur = await getF(); const r = await api('PUT', `/modules/${D}/fields/${F}`, { ...cur, datatypeOptions: { ...cur.datatypeOptions, allowed_values: origAV }, config: { ...cur.config, allowed_values: origAV } });
  out.restore = r.s; out.restoredAV = (await getF()).config.allowed_values;
}
return done(out);
