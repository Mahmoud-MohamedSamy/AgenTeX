const d = await api('GET', '/desk/departments/2a73bbc0-efb3-4250-bf9b-2fdc98236794/agents?limit=100'); out.mkAgents = d.s + ' ' + arr(D(d.j)).map(a => String(a.email || a.user_email || a.display_name || '').slice(0, 6)).join(',');
const ul = arr(D((await api('GET', '/iam/users?limit=200')).j)); const c = ul.find(u => /^fedelav803@/.test(u.email || '')); out.cid = c && c.userId;
const mine = await api('GET', '/desk/me/departments'); out.x = mine.s;
return fin({ out });
