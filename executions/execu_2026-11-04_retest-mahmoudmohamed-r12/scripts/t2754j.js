const o = {}; const T2 = '8598242d-f167-4a4f-9b0b-3ee189c13601', T4 = 'f50e00dc-3f08-4d01-8a41-6e81f2db9fdd';
const st = async id => { const s = await X.state(id); return s ? (s.activeStates || []).join(',') : 'none'; };
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''}`.trim();
for (const [k, id] of [['t2_ownDept', T2], ['t4_deptB', T4]]) { const s = await api('o', 'GET', `desk:/desk/tickets/${id}/shares`); o[k] = s.s + ' ' + JSON.stringify(arr(s.j?.data).map(x => (x.department_name || x.department_id) + ':' + (x.access || x.access_level))); const h = await api('o', 'GET', `desk:/desk/tickets/${id}/activity?page=1&page_size=50`); o[k + '_act'] = arr(h.j?.data).map(e => e.action).filter(a => /share|blueprint/.test(a)).join(','); }
// item 10: rating → transition only for Bad
const mk = async s => (await X.ticket('QA RT12 2754F ' + s)).j?.data?.id; const R1 = await mk('t6 rate bad'), R2 = await mk('t7 rate good'); await sleep(6000);
o.r1state0 = await st(R1);
for (const [k, id, val] of [['bad', R1, 'bad'], ['good', R2, 'good']]) { let res; for (const b of [{ rating: val }, { value: val }, { rating: val, comment: 'QA RT12 2754' }]) { const r = await api('o', 'POST', `desk:/desk/tickets/${id}/happiness-ratings`, b); res = full(r) + ' ' + JSON.stringify(Object.keys(b)); if (r.s < 300 || r.s === 403) break; } o['rate_' + k] = res; }
await sleep(10000); o.badState = await st(R1); o.goodState = await st(R2);
o.ratingsBad = (await api('o', 'GET', `desk:/desk/tickets/${R1}/happiness-ratings`)).t.slice(0, 300);
return o;
