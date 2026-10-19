const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const R = 'd802f26e-3cdc-410d-b1ab-735917a64024'; const out = {}; const S = v => ({ kind: 'string', value: v });
const st = async () => { const g = await api('GET', '/modules/' + D + '/records/' + R); if (g.s !== 200) return g.s; const v = f => ((g.j.data.data || []).find(x => x.field === f) || { value: {} }).value.value; return { approval: v('approval_status'), amount: v('amount'), next_step: v('next_step') }; };
out.user = (await api('GET', '/iam/me')).j.data.display_name; out.start = await st();
const a = await api('PATCH', '/modules/' + D + '/records/' + R, { data: [{ field: 'amount', value: { kind: 'number', value: 3000 } }] }); out.editAmount = a.s + ' ' + a.t.slice(0, 260); out.afterAmount = await st();
const n = await api('PATCH', '/modules/' + D + '/records/' + R, { data: [{ field: 'next_step', value: S('QA RT user1 step') }] }); out.editNextStep = n.s + ' ' + (n.s >= 300 ? n.t.slice(0, 200) : ''); await sleep(3000); out.afterNext = await st();
const s = await api('PATCH', '/modules/' + D + '/records/' + R, { data: [{ field: 'approval_status', value: S('not_submitted') }] }); out.writeStatus = s.s + ' ' + s.t.slice(0, 160);
return out;
