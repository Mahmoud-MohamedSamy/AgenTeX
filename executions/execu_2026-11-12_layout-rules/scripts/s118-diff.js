const ps = arr((await api('GET', '/iam/profiles')).j.data); const adm = ps.find(p => p.name === 'CRM Admin'); const A = arr((await api('GET', '/iam/profiles/' + adm.profileId + '/permissions')).j.data).filter(x => x.effect === 'GRANT').map(x => x.permissionKey);
const U = new Set(arr((await api('GET', '/iam/profiles/11111111-1111-1111-1111-111111111103/permissions')).j.data).filter(x => x.effect === 'GRANT').map(x => x.permissionKey));
return { admin: adm.profileId, diff: A.filter(k => !U.has(k) && /^crm[.:]/.test(k) && /setting|custom|module|layout|field/i.test(k)) };
