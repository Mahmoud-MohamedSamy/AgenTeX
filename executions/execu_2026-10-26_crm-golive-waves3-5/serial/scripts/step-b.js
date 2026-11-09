// Part 1b: change one harmless value each (company fax, business hours Sunday off, fiscal year start month), read back, restore at once.
const out = {};
const getD = async p => (await call('GET', p)).j.data;
const sv = async (app, key) => (await call('GET', `/settings/resolved?app_key=${app}&key=${key}&scope_type=Org`)).j.data;
const putS = (app, key, val, ver) => call('PUT', '/settings/values', { app_key: app, key, scope_type: 'Org', scope_id: null, value_json: val, ...(ver !== undefined ? { expected_version: ver } : {}) });
// company
const c0 = await getD('/iam/tenant/company-profile');
const body = { ...c0 }; for (const k of ['exists', 'id', 'updated_at', 'updated_by', 'time_zone_version', 'logo_url']) delete body[k];
const r1 = await call('PUT', '/iam/tenant/company-profile', { ...body, fax: 'QA W5 fax 0101' });
const c1 = await getD('/iam/tenant/company-profile');
const r1b = await call('PUT', '/iam/tenant/company-profile', { ...body });
const c2 = await getD('/iam/tenant/company-profile');
out.company = { put: r1.s + (r1.s >= 300 ? ' ' + r1.t.slice(0, 200) : ''), faxAfter: c1.fax, restore: r1b.s, faxRestored: c2.fax, faxOriginal: c0.fax, tzSame: c2.time_zone === c0.time_zone, nameSame: c2.name === c0.name };
// business hours
const b0 = await getD('/iam/tenant/business-hours');
const bb = { ...b0, days_active: b0.days_active.filter(d => d !== 'sun') };
const r2 = await call('PUT', '/iam/tenant/business-hours', bb);
const b1 = await getD('/iam/tenant/business-hours');
const r2b = await call('PUT', '/iam/tenant/business-hours', b0);
const b2 = await getD('/iam/tenant/business-hours');
out.businessHours = { put: r2.s + (r2.s >= 300 ? ' ' + r2.t.slice(0, 200) : ''), daysAfter: b1.days_active, restore: r2b.s + (r2b.s >= 300 ? ' ' + r2b.t.slice(0, 200) : ''), restoredEqual: JSON.stringify(b2) === JSON.stringify(b0) };
// fiscal year start month
const f0 = await sv('general', 'general.company.fiscal_year.start_month');
const r3 = await putS('general', 'general.company.fiscal_year.start_month', '7', f0.version);
const f1 = await sv('general', 'general.company.fiscal_year.start_month');
const r3b = await putS('general', 'general.company.fiscal_year.start_month', f0.value_json, f1.version);
const f2 = await sv('general', 'general.company.fiscal_year.start_month');
out.fiscal = { put: r3.s + (r3.s >= 300 ? ' ' + r3.t.slice(0, 200) : ''), after: f1.value_json, restore: r3b.s, restored: f2.value_json, original: f0.value_json, resolvedFrom: f2.resolved_from };
return out;
