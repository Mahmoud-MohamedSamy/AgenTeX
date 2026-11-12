const m = await api('GET', '/modules'); const mods = arr(m.j?.data);
const leads = mods.find(x => x.moduleKey === 'leads');
const out = { modules: m.s + ' n=' + mods.length, leadsId: leads?.id?.slice(0, 8), savedId: I.mod_leads?.slice(0, 8) };
if (leads) { const L = await api('GET', '/modules/' + leads.id + '/layouts'); out.layouts = L.s + ' n=' + arr(L.j?.data).length; const F = await api('GET', '/modules/' + leads.id + '/fields'); out.fields = F.s + ' n=' + arr(F.j?.data).length; const R = await api('GET', '/modules/' + leads.id + '/layout-rules'); out.rules = R.s + ' n=' + arr(R.j?.data).length; }
return out;
