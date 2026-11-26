const made = JSON.parse(fs.readFileSync(RUN + '/zoho/made.json', 'utf8')); made.inputs ||= {};
const pl = vals => vals.map(v => ({ display_value: v, actual_value: v }));
const D = {
  single_line: { data_type: 'text', length: 255 }, multi_line: { data_type: 'textarea', textarea: { type: 'small' } }, rich_text: { data_type: 'textarea', textarea: { type: 'rich_text' } },
  email: { data_type: 'email' }, phone: { data_type: 'phone', length: 30 }, url: { data_type: 'website', length: 255 },
  number: { data_type: 'integer', length: 9 }, decimal: { data_type: 'double', length: 16, decimal_place: 5 }, currency: { data_type: 'currency', length: 16, decimal_place: 2 }, percent: { data_type: 'percent' }, long_integer: { data_type: 'bigint', length: 18 },
  auto_number: { data_type: 'autonumber', auto_number: { prefix: 'MX-', start_number: 1, suffix: '' } }, checkbox: { data_type: 'boolean' },
  pick_list: { data_type: 'picklist', pick_list_values: pl(['Red', 'Green', 'Blue']) }, multi_select: { data_type: 'multiselectpicklist', pick_list_values: pl(['A', 'B', 'C']) },
  date: { data_type: 'date' }, date_time: { data_type: 'datetime' }, lookup: { data_type: 'lookup', lookup: { module: { api_name: 'Accounts' } } }, user: { data_type: 'userlookup' },
  file_upload: { data_type: 'fileupload' }, image_upload: { data_type: 'imageupload' },
  multi_select_lookup: { data_type: 'multiselectlookup', multiselectlookup: { connected_module: { api_name: 'Accounts' }, linking_module: { plural_label: 'QA FX MSL Links', singular_label: 'QA FX MSL Link' } } },
};
for (const [t, d] of Object.entries(D)) { if (made.inputs[t]) continue;
  const r = await zf('POST', '/crm/v8/settings/fields?module=Leads', { fields: [{ field_label: 'QA FX In ' + t, ...d }] }); const f0 = r.j?.fields?.[0];
  if (f0?.details?.id) { made.inputs[t] = { id: f0.details.id }; } log(t, r.s, f0?.code || '', (f0?.message || r.t).slice(0, 160)); fs.writeFileSync(RUN + '/zoho/made.json', JSON.stringify(made, null, 1)); }
const fl = (await zf('GET', '/crm/v8/settings/fields?module=Leads')).j.fields;
for (const [t, v] of Object.entries(made.inputs)) { const f = fl.find(x => x.id === v.id); if (f) v.api = f.api_name; }
fs.writeFileSync(RUN + '/zoho/made.json', JSON.stringify(made, null, 1)); log(Object.fromEntries(Object.entries(made.inputs).map(([k, v]) => [k, v.api])));
log('formula count now', fl.filter(f => f.data_type === 'formula').length);
