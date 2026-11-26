const CAMP = '2188b3c3'; const mods = arr((await api('GET', '/modules?app_key=crm&limit=200')).j?.data);
const o = { mods: mods.map(m => ({ id: m.id, name: m.name || m.label || m.pluralLabel || m.singularLabel, api: m.apiName || m.api_name, ts: m.teamspaceId || m.teamspace_id })).slice(0, 20) };
const camp = mods.find(m => m.id.startsWith(CAMP)); o.campKeys = Object.keys(camp || {});
const mp = await api('GET', `/modules/${camp.id}/permissions`); o.campPerms = { s: mp.s, b: String(JSON.stringify(mp.j?.data)).slice(0, 600) };
for (const t of arr((await api('GET', '/teamspaces')).j?.data)) { const m = await api('GET', `/teamspaces/${t.id}/modules`); o['ts_' + t.slug] = JSON.stringify(arr(m.j?.data).map(x => x.name || x.moduleName || x.apiName || x.moduleId || x.id)).slice(0, 400); }
const la = await api('GET', `/modules/${M.leads}/layouts/assignments`); o.leadLayoutAssign = String(JSON.stringify(la.j?.data)).slice(0, 900);
const ll = await api('GET', `/modules/${M.leads}/layouts`); o.leadLayouts = arr(ll.j?.data).map(l => (l.name) + ':' + String(l.id).slice(0, 8) + (l.isDefault || l.is_default ? '*' : ''));
const pr = arr((await api('GET', '/iam/profiles?app_key=crm')).j?.data); o.profiles = pr.map(p => p.name + ':' + String(p.id).slice(0, 8));
fs.writeFileSync(RUN + '/out/acc-baseline.json', JSON.stringify({ campId: camp.id, campPerms: mp.j?.data, leadLayoutAssign: la.j?.data, profiles: pr.map(p => ({ id: p.id, name: p.name })) }, null, 1)); return o;
