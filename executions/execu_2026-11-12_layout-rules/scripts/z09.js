async (page) => {
  const F = await zFields(page, 'Leads'); const fid = n => F.find(f => f.api_name === n).id; const el = n => ({ type: 'fields', resource: { id: fid(n), api_name: n } });
  const crit = (f, v) => ({ comparator: 'equal', field: { api_name: f, id: fid(f) }, value: v });
  const body = { layout_rules: [{ name: 'QA LR1112 z industry', description: 'qa', primary_field: { api_name: 'Industry', id: fid('Industry') }, conditions: [{ sequence_number: 1, primary_condition: crit('Industry', 'ASP'), sub_conditions: [{ sequence_number: 1, criteria: crit('Industry', 'ASP'), actions: [{ action_type: 'show_fields', elements: [el('Fax')] }, { action_type: 'set_mandatory', elements: [el('Fax')] }] }] }] }] };
  const r = await zf(page, 'POST', '/crm/v9/settings/layout_rules?module=Leads&layout_id=7687862000000091055', body);
  const rec = await zf(page, 'POST', '/crm/v8/Leads', { data: [{ Last_Name: 'QA LR1112 z G4', Company: 'QA LR1112', Industry: 'ERP (Enterprise Resource Planning)', Layout: { id: '7687862000000091055' } }] });
  return { rule: r.s + ' ' + r.t.slice(0, 250), rec: rec.s + ' ' + rec.t.slice(0, 300), ind: F.find(f => f.api_name === 'Industry').pick.slice(0, 8) };
}
