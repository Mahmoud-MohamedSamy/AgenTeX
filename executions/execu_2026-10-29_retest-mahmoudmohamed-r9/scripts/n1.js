// Round 9 baseline of the Anyware tenant (read-only).
const users = arr((await api('GET', '/iam/users?limit=200')).j?.data).map(u => ({ e: u.email, id: u.userId, st: u.status, prof: u.profileNames, ou: u.orgUnitId, mgr: u.reportingManagerId, owner: u.isOwner }));
const ous = (await api('GET', '/iam/org-units')); const prof = (await api('GET', '/iam/profiles'));
const mods = arr((await api('GET', '/modules')).j?.data).map(m => [m.apiName || m.api_name || m.key, m.id]).filter(x => /^(leads|deals|tasks|contacts|accounts|meetings|calls)$/i.test(x[0]));
const hp = (await api('GET', '/settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org')).j?.data;
const mail = (await api('GET', '/mail/connections'));
const me = (await api('GET', '/iam/me')).j?.data;
return done({ me: [me?.user_id, me?.is_sandbox, me?.profiles], users, ous: [ous.s, arr(ous.j?.data).map(o => [o.name, o.id, o.parentId || o.parent_id])],
  prof: arr(prof.j?.data).map(p => [p.name, p.id, p.appKey || p.app_key, p.rank, p.parentId || p.parent_id]), mods, hp: hp && [hp.value_json, hp.version],
  mail: [mail.s, arr(mail.j?.data).map(c => [c.provider, c.email || c.address || c.name, c.status || c.health])] });
