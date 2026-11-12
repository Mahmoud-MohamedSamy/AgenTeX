const ids = JSON.parse(fs.readFileSync('../sl51.json')).ag0; const e = JSON.parse(fs.readFileSync('../e2e2-restore.json')).ag0;
const users = arr((await api('GET', '/iam/users?take=200')).j?.data);
const R = { e2e2Same: JSON.stringify([...(e || [])].sort()) === JSON.stringify([...ids].sort()), who: ids.map(i => { const u = users.find(x => x.userId === i); return u ? u.displayName + ' ' + u.status : 'missing'; }) };
const p = await api('PUT', `/desk/departments/${D}/agents`, { agent_user_ids: ids }); R.put = p.s + (p.s >= 300 ? ' ' + p.t.slice(0, 200) : ''); await sleep(3000);
const back = (await api('GET', `/desk/departments/${D}`)).j?.data?.agent_user_ids || []; R.back = back.length; R.same = ids.every(i => back.includes(i)) && back.length === ids.length;
fs.writeFileSync('../a4/i9-dept-orig.json', JSON.stringify({ D, ids, note: 'restored from sl51.json/nt30.json after GET /agents 405' }));
log(JSON.stringify(R, null, 1));
