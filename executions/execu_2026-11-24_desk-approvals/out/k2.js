const n = await api.D('GET', '/notifications?limit=100'); const NL = arr(n.j?.data?.notifications || n.j?.data?.items || n.j?.data);
const k = NL.filter(x => /K3 remind|K1 form/.test(JSON.stringify(x))).map(x => x.event_type + ' ' + x.created_at);
const again = arr((await api.B('GET', '/notifications?limit=100')).j?.data).filter(x => /overdue/.test(x.event_type)).length;
result('K3', k.some(x => /overdue/.test(x)) ? 'PASS' : 'PARTIAL', `at the limit, one in-app overdue notice per item: B got approval_overdue x2 + submission_overdue (16:02); D (second approver / team) ${JSON.stringify(k)}; not repeated so far (B overdue notices ${again}). Email not checked`);
return { D: k, Bover: again };
