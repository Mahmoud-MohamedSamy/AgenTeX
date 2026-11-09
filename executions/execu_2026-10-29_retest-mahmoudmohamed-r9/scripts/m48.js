const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', STD = 'bf971461-2edc-45f2-b6e4-6e180aa64288'; const out = {};
const std = (await api('GET', `/modules/${L}/layouts/${STD}`)).j?.data;
const r = await api('POST', `/modules/${L}/layouts`, { name: 'QA RT r8 layout probe', views: std.views, assignedProfiles: [], accessMode: 'all_users', status: 'active' }); out.create = r.s + ' ' + r.t.slice(0, 300);
if (r.j?.data?.id) out.del = (await api('DELETE', `/modules/${L}/layouts/${r.j.data.id}`)).s;
out.count = arr((await api('GET', `/modules/${L}/layouts`)).j?.data).length;
return done(out);
