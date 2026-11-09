const out = {};
for (const k of ['general.company.fiscal_year.start_month', 'general.company.fiscal_year.display_format']) { const r = await call('GET', `/settings/resolved?app_key=general&key=${k}&scope_type=Org`); out[k] = r.s === 200 ? r.j.data : r.s + ' ' + r.t.slice(0, 150); }
return out;
