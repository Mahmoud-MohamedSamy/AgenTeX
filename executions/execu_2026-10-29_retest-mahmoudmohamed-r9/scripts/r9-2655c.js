const r = await api('o', 'GET', '/settings/resolved?app_key=general&key=general.company.business_hours&scope_type=Org');
const h = await api('o', 'GET', '/settings/history?app_key=general&key=general.company.business_hours&scope_type=Org&limit=5');
return { resolved: r.s + ' ' + r.t.slice(0, 700), history: h.s + ' ' + h.t.slice(0, 500) };
