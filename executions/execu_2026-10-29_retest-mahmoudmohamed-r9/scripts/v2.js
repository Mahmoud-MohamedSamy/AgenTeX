// NDC-2627 (renamed module) + NDC-2626 (pipeline / stage labels) on a QA deal.
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', STD = '5170500c-b335-479c-96d1-ed138965c345'; const out = {};
const enc = v => ({ kind: 'string', value: String(v) });
const lays = arr((await api('GET', `/modules/${D}/layouts`)).j?.data); const lay = lays.find(l => l.name === 'Standard')?.id;
const r = await api('POST', `/modules/${D}/records`, { layout_id: lay, data: [['name', 'QA RT r8 deal'], ['deal_name', 'QA RT r8 deal'], ['pipeline', STD], ['stage', 'needs_analysis']].map(([f, v]) => ({ field: f, value: enc(v) })) });
const id = r.j?.data?.id; out.create = r.s + ' ' + (id || r.t.slice(0, 250)); out.id = id; if (!id) return done(out);
await go(`/modules/${D}/records/${id}`, 22000); await shot('v2-deal-record');
out.header = (await txt()).split('\n').filter(l => /Standard|needs|Needs|Analysis|5170500c|Pipeline|Stage|Qualification|Closed/i.test(l)).slice(0, 16);
const tl = page.getByText(/^Timeline$/).first(); if (await tl.count()) { await tl.click(); await sleep(8000); } await shot('v2-deal-timeline');
out.timeline = (await txt()).split('\n').filter(l => /created/i.test(l)).slice(0, 5);
return done(out);
