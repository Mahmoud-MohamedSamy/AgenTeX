const mk = (label, rt, expr) => ({ fields: [{ field_label: label, data_type: 'formula', formula: { return_type: rt, expression: expr } }] });
for (const v of ['v8', 'v6', 'v2.2']) { const r = await zf('POST', `/crm/${v}/settings/fields?module=Leads`, mk('QA FX probe', 'text', 'Nofunc(1)')); log(v, r.s, r.t.slice(0, 700)); if (r.s < 500 && !/INVALID_URL|URL_NOT/i.test(r.t)) break; }
const r2 = await zf('POST', `/crm/v8/settings/fields?module=Leads`, mk('QA FX probe2', 'text', 'Upper(${Leads.Last Name})')); log('valid', r2.s, r2.t.slice(0, 700));
