// Confirm the 30-layout cap: delete my own QA layout (QA RT r8 layout 6bf87122, made for NDC-2650), then create one probe (deleted right after).
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
out.delMine = (await api('DELETE', `/modules/${L}/layouts/6bf87122-6d42-48e9-acb1-1b5a63e4fcfb`)).s; out.count = arr((await api('GET', `/modules/${L}/layouts`)).j?.data).length;
const std = (await api('GET', `/modules/${L}/layouts/bf971461-2edc-45f2-b6e4-6e180aa64288`)).j?.data;
const r = await api('POST', `/modules/${L}/layouts`, { name: 'QA RT r8 probe 30', views: std.views, assignedProfiles: [], accessMode: 'all_users', status: 'active' }); out.create30 = r.s + ' ' + r.t.slice(0, 120); const id = r.j?.data?.id;
const r2 = await api('POST', `/modules/${L}/layouts`, { name: 'QA RT r8 probe 31', views: std.views, assignedProfiles: [], accessMode: 'all_users', status: 'active' }); out.create31 = r2.s + ' ' + r2.t.slice(0, 200); const id2 = r2.j?.data?.id;
if (id) out.del30 = (await api('DELETE', `/modules/${L}/layouts/${id}`)).s; if (id2) out.del31 = (await api('DELETE', `/modules/${L}/layouts/${id2}`)).s;
return done(out);
