async (page) => {
  const F = await zFields(page, 'Leads'); const id = n => F.find(f => f.api_name === n).id;
  const crit = { comparator: 'equal', field: { api_name: 'Designation', id: id('Designation') }, value: 'CEO' };
  const out = [];
  for (const ty of ['fields', 'Field', 'FIELD', 'field_element', 'Fields']) {
    const body = { layout_rules: [{ name: 'QA LR1112 zoho text primary', description: 'qa', primary_field: { api_name: 'Designation', id: id('Designation') }, conditions: [{ sequence_number: 1, primary_condition: crit, sub_conditions: [{ sequence_number: 1, criteria: crit, actions: [{ action_type: 'show_fields', elements: [{ type: ty, resource: { id: id('Website'), api_name: 'Website' } }] }] }] }] }] };
    const r = await zf(page, 'POST', '/crm/v9/settings/layout_rules?module=Leads&layout_id=7687862000000091055', body); out.push(ty + ' ' + r.s + ' ' + r.t.slice(0, 400)); if (r.s < 300) break; }
  return out;
}
