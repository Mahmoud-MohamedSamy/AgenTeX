const o = {};
const p = await api('GET', '/iam/profiles'); o.deskProfiles = arr(p.j && p.j.data).filter(x => x.appKey === 'desk').map(x => x.name + ' ' + x.profileId + ' rank' + x.rank);
const u = await api('GET', '/iam/users?limit=100'); const L = arr(u.j && u.j.data); o.userKeys = L[0] && Object.keys(L[0]);
const ms = L.find(x => /Mahmoud Samy/i.test(JSON.stringify(x))); o.ms = ms && JSON.stringify(ms).replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 700);
return o;
