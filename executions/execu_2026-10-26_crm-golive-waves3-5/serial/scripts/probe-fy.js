const out = {};
for (const p of ['/iam/tenant/fiscal-year', '/iam/tenant/fiscal-years', '/settings/resolved?app_key=general&key=general.company.fiscal_year&scope_type=Org', '/settings/resolved?app_key=general&key=general.fiscal_year&scope_type=Org', '/iam/tenant/company-profile']) { const r = await call('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 300); }
const hub = await call('GET', '/settings/hub'); const txt = hub.t; out.hubFiscal = (JSON.stringify(hub.j) || '').match(/.{0,200}fiscal.{0,200}/i)?.[0];
return out;
