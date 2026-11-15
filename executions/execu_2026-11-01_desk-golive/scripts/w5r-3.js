const L = arr(D((await api('GET', '/modules/' + TM + '/layouts')).j)); const st = L.find(l => l.name === 'Standard'); out.layoutKeys = Object.keys(st || {}).join(',');
const s = JSON.stringify(st); const i = s.indexOf('"status"'); out.statusInLayout = i >= 0 ? s.slice(Math.max(0, i - 200), i + 400) : 'none';
const one = await api('GET', '/modules/' + TM + '/layouts/' + st.id); const s2 = JSON.stringify(D(one.j)); const j = s2.search(/default/i); out.layoutDefault = s2.match(/"[a-z_]*default[a-z_]*":[^,]{0,120}/gi)?.slice(0, 15);
const us = await api('GET', '/iam/users?limit=200'); const ul = arr(D(us.j)); out.uKeys = Object.keys(ul[0] || {}).join(',');
const c = ul.find(u => JSON.stringify(u).includes('fedelav803')); out.c = c && JSON.stringify({ p: c.profiles, pa: c.profiles_by_app, pd: c.profile_details }).slice(0, 600);
// ticket activity count (2635 item)
const tk = arr(D((await api('GET', '/modules/' + TM + '/records?limit=1&sort=-created_at')).j)).map(flat)[0];
return fin({ out });
