const L = arr(D((await api('GET', '/modules/' + TM + '/layouts')).j));
out.ts = L.map(l => [l.name, l.isDefault, (l.departmentIds || []).length, JSON.stringify(l.ticketStatuses).slice(0, 260)]);
const ul = arr(D((await api('GET', '/iam/users?limit=200')).j)); const c = ul.find(u => /^fedelav803@/.test(u.email || '')); out.cProf = c && c.profileNames;
const pl = arr(D((await api('GET', '/iam/profiles')).j)); out.profs = pl.map(p => [p.id, p.name, p.app_key || p.app || ''].join(' | ')).slice(0, 30);
return fin({ out });
