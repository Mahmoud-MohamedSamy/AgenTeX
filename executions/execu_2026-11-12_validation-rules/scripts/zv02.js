async (page, ctx, h) => {
  const cf = await zf(page, 'POST', '/crm/v8/settings/fields?module=Leads', { fields: [{ field_label: 'QA VR1112 Code', data_type: 'text', length: 100 }] });
  const f = (await zFields(page, 'Leads')).find(x => x.label === 'QA VR1112 Code');
  const body = { validation_rules: [{ name: 'QA VR1112 R1', layout: { id: '7687862000000091055' }, field: { api_name: f?.api_name, id: f?.id }, type: 'field_rule',
    conditions: [{ sequence_number: 1, criteria: { comparator: 'equal', field: { api_name: f?.api_name }, value: 'X' }, alert: { message: 'QA VR1112 equals X blocked' } }] }] };
  const r = await zf(page, 'POST', '/crm/v8/settings/validation_rules?module=Leads', body);
  return { cf: cf.s + ' ' + cf.t.slice(0, 300), f, r: r.s + ' ' + r.t.slice(0, 1200) };
}
