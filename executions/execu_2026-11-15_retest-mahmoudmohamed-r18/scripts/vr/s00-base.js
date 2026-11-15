const mid = await modId(); const o = {};
o.rules = (await rules(mid)).map(r => [r.name, r.layoutId, r.status, r.conditionError]);
const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data); o.layouts = L.map(x => [x.name, x.id, x.isDefault]);
const u = await api('GET', '/iam/users?limit=200&pageSize=200'); const me = arr(u.j.data).find(x => /mahmoud samy/i.test(x.displayName || '')); o.u1 = me && { id: me.userId, p: me.profileNames, ou: me.orgUnitId };
const fp = await api('GET', '/modules/' + mid + '/field-permissions'); o.fp = fp.s + ' n=' + arr(fp.j && fp.j.data).length; o.fpSample = arr(fp.j && fp.j.data).slice(0, 3);
const pr = await api('GET', '/iam/profiles'); o.profiles = arr(pr.j && pr.j.data).map(p => [p.name, p.id, p.app || p.appKey]).slice(0, 20);
return o;
