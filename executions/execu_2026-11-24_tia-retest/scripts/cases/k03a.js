const me = (await api('GET', '/iam/me')).j?.data || {};
const perms = arr((await api('GET', '/iam/me/permissions?app_key=crm')).j?.data);
const fp = arr((await api('GET', `/modules/${M.leads}/field-permissions`)).j?.data).map(x => ({ field: x.fieldName, profile: x.profileId, perm: x.permission }));
const eff = (await api('GET', `/modules/${M.leads}/field-permissions/effective`)).j?.data;
const L = arr((await api('GET', `/modules/${M.leads}/records?page=1&per_page=50`)).j?.data);
const withHidden = L.filter(x => JSON.stringify(x).includes('"single_line"')).slice(0, 3).map(x => x.id);
const profs = (me.profiles || []).map(p => p.profile_id + ':' + p.name);
const st = (await api('GET', '/agents/tia/status')).j?.data;
return { who: process.env.WHO, profs, tia: perms.includes('ai:tia:use'), status: st, fieldPerms: fp, effective: eff && { bypass: eff.bypass, single_line: eff.fields?.single_line }, leadsVisible: L.length, leadsShowingSingleLine: withHidden.length };
