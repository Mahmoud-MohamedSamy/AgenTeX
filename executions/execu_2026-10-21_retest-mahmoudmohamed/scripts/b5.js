const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', L = 'fcba0068-d67f-44f5-8412-cdef9c09e16e', P1 = '640e03a4-9c24-4b06-8d7d-5c1db2711b9b';
const s = v => ({ kind: 'string', value: v });
const mk = async (name, extra) => { const r = await api('POST', `/modules/${D}/records`, { data: [{ field: 'pipeline', value: s(P1) }, { field: 'deal_name', value: s(name) }, { field: 'amount', value: s('5000') }, ...extra], layout_id: L });
  const id = r.j && r.j.data && (r.j.data.id || (r.j.data[0] && r.j.data[0].id)); let got = null;
  if (id) { const g = await api('GET', `/modules/${D}/records/${id}`); got = Object.fromEntries(g.j.data.data.filter(x => /pipeline|stage/.test(x.field)).map(x => [x.field, x.value.value])); }
  return { s: r.s, id, got, err: r.s >= 300 ? r.t.slice(0, 400) : undefined }; };
const a = await mk('QA RT 1302 api no stage', []);
const b = await mk('QA RT 1302 api stage test-01', [{ field: 'stage', value: s('test-01') }]);
return done({ a, b });
