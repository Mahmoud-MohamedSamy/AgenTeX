// Cleanup step 8 (run as each test user): delete own "QA RT …" Leads views; drop the All Leads column override from Leads list-preferences.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = { deleted: {} };
await go('/', 6000);
const me = await api('GET', '/iam/me'); out.me = me.j && me.j.data && me.j.data.display_name;
const v = await api('GET', '/modules/' + L + '/views?kind=list'); const vl = arr(v.j && v.j.data && (v.j.data.views || v.j.data));
const allLeads = vl.find(x => x.name === 'All Leads'); out.allLeadsId = allLeads && allLeads.id;
for (const x of vl.filter(x => /^QA RT/.test(x.name))) { const r = await api('DELETE', '/modules/' + L + '/views/' + x.id); out.deleted[x.name] = r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 150) : ''); }
const g = await api('GET', '/modules/' + L + '/list-preferences'); const prefs = (g.j && g.j.data && g.j.data.prefs) || {}; const vc = prefs.viewColumns || {};
out.viewColumnKeys = Object.keys(vc).map(k => k === (allLeads && allLeads.id) ? k + ' (All Leads)' : k);
if (allLeads && vc[allLeads.id]) { delete vc[allLeads.id]; prefs.viewColumns = vc; const p = await api('PUT', '/modules/' + L + '/list-preferences', { prefs, version: g.j.data.version }); out.prefsPut = p.s + ' ' + p.t.slice(0, 120); }
return done(out);
