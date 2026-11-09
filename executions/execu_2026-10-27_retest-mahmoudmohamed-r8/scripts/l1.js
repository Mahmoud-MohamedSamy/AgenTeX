const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const lays = arr((await api('GET', `/modules/${L}/layouts`)).j?.data); const std = lays.find(l => l.name === 'Standard');
let qa = lays.find(l => l.name === 'QA RT r6 layout');
if (!qa) { const r = await api('POST', `/modules/${L}/layouts`, { name: 'QA RT r6 layout', views: std.views, assignedProfiles: [], status: 'active' }); qa = r.j?.data; if (!qa) return done({ err: r.s + ' ' + r.t.slice(0, 300) }); }
await go(`/settings/modules-and-fields/${L}/layouts/${qa.id}`, 15000); await shot('lb-00-qa-layout');
const t = (await txt()).split('\n').filter(l => l.trim());
return done({ qa: qa.id, layouts: lays.map(l => l.name), palette: t.slice(0, 120).join(' | ').slice(0, 2500) });
