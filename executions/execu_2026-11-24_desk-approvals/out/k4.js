const o = {};
for (const k of ['O', 'A', 'B', 'D', 'S']) { const n = await api[k]('GET', '/notifications?limit=100'); const NL = arr(n.j?.data?.notifications || n.j?.data?.items || n.j?.data);
  o[k] = NL.filter(x => /K1 default|K3 remind|K1 form/.test(JSON.stringify(x)) && /escalat|overdue/.test(x.event_type)).map(x => x.event_type + ' ' + x.created_at.slice(11, 19)); }
const it = (await api.O('GET', '/desk/approvals/' + ST.K['K1 default'].id)).j?.data?.item; o.k1 = JSON.stringify({ overdue: it?.overdue, escalated: it?.escalated_at || it?.approval?.escalated_at });
const esc = Object.entries(o).filter(([k, v]) => Array.isArray(v) && v.some(x => /escalat/.test(x)));
result('K4', esc.length ? 'PASS' : 'FAIL', `at 2x the limit (17:01 UTC), escalation notices: ${JSON.stringify(Object.fromEntries(Object.entries(o).filter(([k]) => k.length === 1)))}. A (requester) has no reporting manager set; department approval managers = admins`);
result('E2E-3', esc.length ? 'PARTIAL' : 'FAIL', `request to B+D -> overdue notices at the limit (K3) -> escalation ${esc.length ? 'sent' : 'not seen'} (K4); reassign (E18) and history (L1) tested separately`);
return o;
