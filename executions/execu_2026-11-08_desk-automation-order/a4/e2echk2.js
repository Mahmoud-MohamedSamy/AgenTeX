const p = await api('GET', `/desk/departments/${D}/round-robin-preferences`); log('rrPrefs', p.s, p.t.slice(0, 400));
const q = await api('GET', '/desk/queues/agents'); const L = arr(q.j?.data?.agents || q.j?.data); log('presence', JSON.stringify(L.filter(x => ['876ce871-2b02-4854-89a7-68050391c62b', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4'].includes(x.user_id)).map(x => ({ n: x.display_name || x.name, online: x.presence?.online, ch: x.presence?.channels }))));
const t = await api('GET', '/desk/email-templates?take=200'); log('tplRaw', t.s, t.t.slice(0, 200)); const j = t.j?.data; const TL = Array.isArray(j) ? j : (j?.templates || j?.items || []);
log('useCases', JSON.stringify([...new Set(TL.map(x => x.notification_type + '/' + x.use_case))]).slice(0, 700));
