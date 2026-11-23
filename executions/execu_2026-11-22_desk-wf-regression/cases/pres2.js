const DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const on = (await api('GET', '/desk/agents/online')).j?.data; const ag = arr(on?.agents);
const q = await api('POST', '/desk/agents/presence/query', { user_ids: [DEV2, TU1] });
return { onlineList: ag.map(a => a.name + ':' + a.status), dev2InOnline: !!ag.find(a => a.user_id === DEV2), query: q.s + ' ' + q.t.slice(0, 400) };
