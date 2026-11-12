async (page, ctx, h) => {
  const L='7687862000000091055';
  const fa = { api_name: 'QA_VR1112_Code', id: '7687862000000765060' };
  const out = {};
  const tries = [
    { name: 'QA VR1112 R1', field: fa, type: 'field_rule', conditions: [{ sequence_number: 1, primary_condition: { comparator: 'equal', field: fa, value: 'X' }, alert: 'QA VR1112 equals X blocked' }] },
    { name: 'QA VR1112 R1', field: fa, type: 'field_rule', conditions: [{ sequence_number: 1, primary_condition: { comparator: 'equal', value: 'X' }, alert: 'QA VR1112 equals X blocked' }] },
  ];
  for (let i=0;i<tries.length;i++){ const r = await zf(page, 'POST', '/crm/v8/settings/validation_rules?module=Leads&layout_id='+L, { validation_rules: [tries[i]] }); out['t'+i]=r.s+' '+r.t.slice(0,600); if (r.s<300) break; }
  const g = await zf(page, 'GET', '/crm/v8/settings/validation_rules?module=Leads&layout_id='+L); out.g = g.s+' '+g.t.slice(0,1200);
  return out;
}
