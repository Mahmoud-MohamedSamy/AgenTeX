const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', LT = '7d1b1a96-a590-45d7-9551-64b1cb7e41d1', TP = 'e96bf929-d1fe-45c9-8fb8-b1fcd7ca1a91';
const s = v => ({ kind: 'string', value: v });
const pv = async id => Object.fromEntries((await api('GET', `/modules/${D}/records/${id}`)).j.data.data.filter(x => /pipeline|stage/.test(x.field)).map(x => [x.field, x.value.value]));
const c = await api('POST', `/modules/${D}/records`, { data: [{ field: 'pipeline', value: s(TP) }, { field: 'deal_name', value: s('QA RT 1302 test-layout') }, { field: 'amount', value: s('5000') }, { field: 'name', value: s('QA RT 1302 test-layout') }], layout_id: LT });
const id = c.j?.data?.id; const out = { create: c.s + ' ' + (c.s >= 300 ? c.t.slice(0, 400) : ''), id, afterCreate: id && await pv(id) };
if (id) for (const st of ['test-02', 'test-01', 'qualification']) { const p = await api('PATCH', `/modules/${D}/records/${id}`, { data: [{ field: 'stage', value: s(st) }] }); out['stage ' + st] = { s: p.s, err: p.s >= 300 ? (p.j?.error?.details?.[0]?.message || p.t.slice(0, 300)) : undefined, now: await pv(id) }; }
return done(out);
