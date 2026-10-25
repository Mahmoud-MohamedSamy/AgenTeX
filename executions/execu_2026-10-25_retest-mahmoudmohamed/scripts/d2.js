const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', LS = 'fcba0068-d67f-44f5-8412-cdef9c09e16e';
const s = v => ({ kind: 'string', value: v });
const rs = arr((await api('GET', `/modules/${D}/records?page=1&per_page=100`)).j?.data); const st = {}; for (const r of rs) { const v = (r.data || []).find(d => d.field === 'stage')?.value?.value; if (v) st[v] = (st[v] || 0) + 1; }
const mk = async (n, stage) => { const data = [{ field: 'name', value: s(n) }, { field: 'deal_name', value: s(n) }]; if (stage) data.push({ field: 'stage', value: s(stage) }); const r = await api('POST', `/modules/${D}/records`, { data, layout_id: LS }); return n + ' ' + r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 200)); };
const first = Object.keys(st)[0];
return done({ stages: st, a: await mk('QA RT 2113 a', null), b: await mk('QA RT 2113 b', first) });
