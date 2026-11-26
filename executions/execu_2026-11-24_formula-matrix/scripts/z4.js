const mk = (label, rt, expr) => ({ fields: [{ field_label: label, data_type: 'formula', formula: { return_type: rt, expression: expr } }] });
const made = [];
for (const [rt, ex] of [['text', 'Upper(${Last_Name})'], ['text', 'Upper(${Leads.Last_Name})'], ['text', 'Upper(${Leads.Last Name})'], ['string', 'Upper(${Last_Name})'], ['text', 'Upper(Last_Name)']]) {
  const r = await zf('POST', `/crm/v8/settings/fields?module=Leads`, mk('QA FX probe ' + made.length, rt, ex)); log(rt, ex, r.s, r.t.slice(0, 300)); const id = r.j?.fields?.[0]?.details?.id; if (id) { made.push(id); break; } }
fs.writeFileSync(RUN + '/zoho/made.json', JSON.stringify({ fields: made }, null, 1));
if (made[0]) { const g = await zf('GET', `/crm/v8/settings/fields/${made[0]}?module=Leads`); log('read', g.t.slice(0, 900)); }
