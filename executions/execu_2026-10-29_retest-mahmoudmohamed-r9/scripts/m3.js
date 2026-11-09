const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const t = (await api('GET', `/modules/${L}/layouts/6261fa51-0000-0000-0000-000000000000`)); 
const lays = arr((await api('GET', `/modules/${L}/layouts`)).j?.data); const sel = lays.filter(x => x.accessMode === 'selected').slice(0, 2);
out.selected = sel.map(x => ({ name: x.name, assignedProfiles: JSON.stringify(x.assignedProfiles).slice(0, 300) }));
// what the screen sends: open the QA layout's access dialog
const reqs = []; page.on('request', r => { if (['PUT', 'POST', 'PATCH'].includes(r.method()) && r.url().includes('/layouts')) reqs.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 600)); });
await go(`/settings/modules-and-fields/${L}/layouts`, 12000); await shot('m3-layouts-list');
out.text = (await txt()).split('\n').filter(l => /QA RT r8|Access|profiles|All users/i.test(l)).slice(0, 12);
out.reqs = reqs;
return done(out);
