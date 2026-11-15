const mid = await modId(); const o = {};
const Ls = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data); const def = Ls.find(x => x.isDefault); const full = await getLayout(mid, def.id);
const c = await api('POST', '/modules/' + mid + '/layouts', { name: P + ' J6b Layout', description: 'QA J6 UI', views: Object.fromEntries(Object.entries(full.views || {}).map(([k, v]) => [k, { layout: v.layout }])), status: full.status, accessMode: full.accessMode, assignedProfiles: full.assignedProfiles });
const lid = c.j && c.j.data && c.j.data.id; LED('layout "QA RT18 J6b Layout" ' + lid + ' (Leads)'); I.lJ6b = lid; SAVE();
const r = await mkRule(mid, { name: P + ' J6b rule', layoutId: lid, primaryField: 'first_name', branches: [B(C('eq', 'first_name', 'J6BAD'), 'QA J6b')] }); I.rJ6b = r.j && r.j.data && r.j.data.id; SAVE();
o.r = SR(r).slice(0, 100); o.lid = lid; return o;
