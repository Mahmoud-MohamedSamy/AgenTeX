async (page) => {
  const d = await zf(page, 'DELETE', '/crm/v9/settings/layout_rules/7687862000000765029?module=Leads&layout_id=7687862000000091055');
  const F = await zFields(page, 'Leads'); const fid = n => F.find(f => f.api_name === n).id; const el = n => ({ type: 'fields', resource: { id: fid(n), api_name: n } });
  const V = 'ASP (Application Service Provider)'; const crit = (f, v) => ({ comparator: 'equal', field: { api_name: f, id: fid(f) }, value: v });
  const body = { layout_rules: [{ name: 'QA LR1112 z industry', description: 'qa', primary_field: { api_name: 'Industry', id: fid('Industry') }, conditions: [{ sequence_number: 1, primary_condition: crit('Industry', V), sub_conditions: [{ sequence_number: 1, criteria: crit('Industry', V), actions: [{ action_type: 'show_fields', elements: [el('Fax')] }, { action_type: 'set_mandatory', elements: [el('Fax')] }] }] }] }] };
  const r = await zf(page, 'POST', '/crm/v9/settings/layout_rules?module=Leads&layout_id=7687862000000091055', body);
  return { del: d.s + ' ' + d.t.slice(0, 150), rule: r.s + ' ' + r.t.slice(0, 200) };
}
