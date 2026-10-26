const out = {};
const as = await call('POST', '/iam/users/45ffbc5b-7859-4c21-be9e-7b5f30747ca2/profiles', { profile_id: '11111111-1111-1111-1111-111111111103', scope_id: '60aeb9ce-e602-4e95-aaef-de3ceba25a3e', replace: true }); out.assignBack = as.s;
for (const id of ['b9417456-4f27-4cde-ad35-a05cdf8c3ebf', '5a8c3567-c6d2-4cf8-aa72-67e948b8e21b']) { const d = await call('DELETE', `/modules/${MODS.leads}/field-permissions/${id}`); out['fp ' + id.slice(0, 8)] = d.s; }
const dp = await call('DELETE', '/iam/profiles/552c9fe7-045e-4626-8cf2-5ecbee270441'); out.delProfile = dp.s + ' ' + dp.t.slice(0, 150);
const u = await call('GET', '/iam/users?limit=200'); const me = (u.j.data || []).find(x => x.id === '45ffbc5b-7859-4c21-be9e-7b5f30747ca2'); out.user = me && JSON.stringify({ profile: me.profileName || me.profile_name || me.profiles, ou: me.orgUnitName || me.org_unit_name }).slice(0, 200);
return out;
