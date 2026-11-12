const u = await api('GET', '/iam/users?limit=200'); const L = arr(u.j && u.j.data);
const ms = L.find(x => /mahmoud samy/i.test(x.displayName || '')); if (!ms) return { n: L.length, names: L.map(x => x.displayName).slice(0, 30) };
const d = await api('GET', '/iam/users/' + ms.userId); const dd = d.j && d.j.data || {};
return { id: ms.userId, profiles: ms.profileNames, detailKeys: Object.keys(dd), prof: JSON.stringify(dd.profiles || dd.profilesByApp || dd.profiles_by_app || '').slice(0, 400) };
