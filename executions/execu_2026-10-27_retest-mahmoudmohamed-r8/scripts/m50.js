const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {}; const mine = (await api('GET', `/modules/${L}/layouts/6bf87122-6d42-48e9-acb1-1b5a63e4fcfb`)).j?.data; out.mineExists = !!mine;
const r = await api('POST', `/modules/${L}/layouts`, { name: 'QA RT r8 probe copy', views: mine.views, assignedProfiles: [], accessMode: 'all_users', status: 'active' }); out.copyMine = r.s + ' ' + r.t.slice(0, 160); if (r.j?.data?.id) out.del = (await api('DELETE', `/modules/${L}/layouts/${r.j.data.id}`)).s;
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const dl = arr((await api('GET', `/modules/${D}/layouts`)).j?.data); out.dealsLayouts = dl.length;
return done(out);
