const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const R = 'd802f26e-3cdc-410d-b1ab-735917a64024'; const out = {}; const S = v => ({ kind: 'string', value: v });
const st = async () => { const g = await api('GET', '/modules/' + D + '/records/' + R); const v = f => ((g.j.data.data || []).find(x => x.field === f) || { value: {} }).value.value; return { approval: v('approval_status'), amount: v('amount'), next_step: v('next_step') }; };
const upd = async data => { let r = await api('PATCH', '/modules/' + D + '/records/' + R, { data }); if (r.s === 404 || r.s === 405) r = await api('PUT', '/modules/' + D + '/records/' + R, { data }); return r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 260) : ''); };
out.start = await st();
out.editNextStep = await upd([{ field: 'next_step', value: S('QA RT follow-up call') }]); await sleep(4000); out.afterNextStep = await st();
out.editAmount = await upd([{ field: 'amount', value: { kind: 'number', value: 2000 } }]); await sleep(2000); out.afterAmount = await st();
out.writeStatus = await upd([{ field: 'approval_status', value: S('not_submitted') }]); await sleep(2000); out.afterStatus = await st();
const tl = await api('GET', '/modules/' + D + '/records/' + R + '/timeline?page=1&per_page=20'); out.timeline = tl.s + ' ' + (tl.t.match(/"(title|summary|event_type|type|action)":"[^"]{0,80}"/g) || []).slice(0, 12).join(' | ');
return out;
