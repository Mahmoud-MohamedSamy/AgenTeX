const M = '064aa360-7e4b-4e0b-9e68-831c469fa6e9'; const out = {}; const l0 = arr((await api('GET', `/modules/${M}/layouts`)).j?.data)[0]; const g = (await api('GET', `/modules/${M}/layouts/${l0.id}`)).j?.data;
const r = await api('POST', `/modules/${M}/layouts`, { name: 'QA RT r8 layout probe', views: g.views, assignedProfiles: [], accessMode: 'all_users', status: 'active' }); out.qaModule = r.s + ' ' + r.t.slice(0, 200);
if (r.j?.data?.id) out.del = (await api('DELETE', `/modules/${M}/layouts/${r.j.data.id}`)).s;
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const r2 = await api('POST', `/modules/${L}/layouts`, { name: 'QA RT r8 probe minimal', views: {}, assignedProfiles: [], accessMode: 'all_users', status: 'active' }); out.leadsMinimal = r2.s + ' ' + r2.t.slice(0, 200); if (r2.j?.data?.id) out.del2 = (await api('DELETE', `/modules/${L}/layouts/${r2.j.data.id}`)).s;
return done(out);
