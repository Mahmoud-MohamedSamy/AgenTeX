async (page) => {
  const F = await zFields(page, 'Leads'); const fid = n => F.find(f => f.api_name === n).id; const el = n => ({ type: 'fields', resource: { id: fid(n), api_name: n } });
  const crit = (f, v) => ({ comparator: 'equal', field: { api_name: f, id: fid(f) }, value: v });
  const out = [];
  for (const ro of ['set_read_only_fields', 'read_only', 'set_readonly', 'make_read_only', 'read_only_fields']) {
    const body = { layout_rules: [{ name: 'QA LR1112 z mand ro', description: 'qa', primary_field: { api_name: 'Industry', id: fid('Industry') }, conditions: [{ sequence_number: 1, primary_condition: crit('Industry', 'ASP'), sub_conditions: [{ sequence_number: 1, criteria: crit('Industry', 'ASP'), actions: [{ action_type: 'set_mandatory', elements: [el('Fax')] }, { action_type: ro, elements: [el('Fax')] }] }] }] }] };
    const r = await zf(page, 'POST', '/crm/v9/settings/layout_rules?module=Leads&layout_id=7687862000000091055', body); out.push(ro + ' ' + r.s + ' ' + r.t.slice(0, 300)); if (!/actions\[1\]\.action_type/.test(r.t)) break; }
  return out;
}
