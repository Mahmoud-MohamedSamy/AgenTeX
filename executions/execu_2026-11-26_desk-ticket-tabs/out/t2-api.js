const out = {}; const id = ST.T.t1; const day = new Date().toISOString().slice(0, 10);
const list = async (who = 'O', tid = id) => { const r = await api[who]('GET', TK(tid) + '/time-entries'); return arr(r.j?.data); };
let e = (await list())[0];
// T-03 edit to 45
const u = await api.O('PUT', TK(id) + '/time-entries/' + e.id, { hours: 0, minutes: 45, seconds: 0, billing_type: 'billable', description: 'QA TT 45m', work_date: day });
out['T-03'] = E(u) + ' dur=' + u.j?.data?.duration_seconds;
// T-05 validation
const bad = { zero: { hours: 0, minutes: 0, seconds: 0 }, neg: { hours: 0, minutes: -5, seconds: 0 }, min60: { hours: 0, minutes: 60, seconds: 0 }, sec60: { hours: 0, minutes: 0, seconds: 75 }, over24: { hours: 25, minutes: 0, seconds: 0 }, exactly24: { hours: 24, minutes: 0, seconds: 0 }, negDur: { duration_seconds: -60 }, badBilling: { hours: 0, minutes: 10, billing_type: 'free' }, noBilling: { hours: 0, minutes: 10 }, futureDate: { hours: 0, minutes: 10, work_date: '2030-01-01' }, badDate: { hours: 0, minutes: 10, work_date: '2026-02-30' }, negCost: { hours: 0, minutes: 10, hourly_rate: -5 }, longDesc: { hours: 0, minutes: 10, description: 'd'.repeat(10001) } };
for (const [k, b] of Object.entries(bad)) { const r = await api.O('POST', TK(id) + '/time-entries', { work_date: day, billing_type: 'billable', ...b, ...(k === 'noBilling' ? { billing_type: undefined } : {}) }); out['T-05 ' + k] = E(r).slice(0, 160) + (r.s < 300 ? ' billing=' + r.j?.data?.billing_type + ' dur=' + r.j?.data?.duration_seconds : ''); }
// T-06 cost
const c = await api.O('POST', TK(id) + '/time-entries', { hours: 0, minutes: 45, seconds: 0, billing_type: 'billable', hourly_rate: 100, additional_cost: 20, ticket_charge_type: 'consultation', description: 'QA TT cost', work_date: day });
out['T-06'] = E(c) + ' total_cost=' + c.j?.data?.total_cost + ' rate=' + c.j?.data?.hourly_rate + ' add=' + c.j?.data?.additional_cost + ' charge=' + c.j?.data?.ticket_charge_type;
const c2 = await api.O('POST', TK(id) + '/time-entries', { hours: 1, minutes: 20, seconds: 0, billing_type: 'billable', hourly_rate: 90, additional_cost: 0, work_date: day, description: 'QA TT cost2' });
out['T-06b 1h20 x 90'] = E(c2) + ' total_cost=' + c2.j?.data?.total_cost + ' (expect 120)';
// T-08 for another agent
const o = await api.O('POST', TK(id) + '/time-entries', { hours: 0, minutes: 15, billing_type: 'non_billable', agent_user_id: ST.C_ID, work_date: day, description: 'QA TT for C' });
out['T-08'] = E(o) + ' agent=' + (o.j?.data?.agent_user_id === ST.C_ID ? 'C' : o.j?.data?.agent_user_id);
const mk = await api.O('POST', TK(id) + '/time-entries', { hours: 0, minutes: 15, billing_type: 'billable', agent_user_id: '00000000-0000-0000-0000-000000000001', work_date: day });
out['T-08 unknown agent'] = E(mk).slice(0, 160);
// T-16 C
const all = await list(); const ownerEntry = all.find(x => x.agent_user_id === ST.O_ID && x.id !== e.id);
out['T-16 C list'] = (await list('C')).length + ' entries seen by C';
out['T-16 C edit owner entry'] = E(await api.C('PUT', TK(id) + '/time-entries/' + ownerEntry.id, { hours: 0, minutes: 1, billing_type: 'billable', work_date: day }));
out['T-16 C delete owner entry'] = E(await api.C('DELETE', TK(id) + '/time-entries/' + ownerEntry.id));
const cOwn = await api.C('POST', TK(id) + '/time-entries', { hours: 0, minutes: 5, billing_type: 'billable', work_date: day, description: 'QA TT by C' }); out['T-16 C add own'] = E(cOwn) + ' agent=' + (cOwn.j?.data?.agent_user_id === ST.C_ID ? 'C' : '?');
out['T-16 C add for owner'] = E(await api.C('POST', TK(id) + '/time-entries', { hours: 0, minutes: 5, billing_type: 'billable', agent_user_id: ST.O_ID, work_date: day })).slice(0, 160);
out['T-16 C on mkt ticket'] = E(await api.C('POST', TK(ST.R.t3) + '/time-entries', { hours: 0, minutes: 5, billing_type: 'billable', work_date: day }));
// T-04 delete
const d = await api.O('DELETE', TK(id) + '/time-entries/' + e.id); out['T-04'] = E(d) + ' left=' + (await list()).length;
const after = await list(); out.final = after.map(x => `${x.hours}h${x.minutes}m ${x.billing_type} cost=${x.total_cost} ${x.agent_user_id === ST.C_ID ? 'C' : 'O'}`);
return out;
