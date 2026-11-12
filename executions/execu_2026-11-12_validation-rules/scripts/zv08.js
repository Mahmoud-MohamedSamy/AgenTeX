async (page, ctx, h) => {
  const L='7687862000000091055';
  const afe = { apply_feature_execution: [{ name: 'criteria_validation_rule' }] };
  const put = async (id, rec, ex={}) => { const r = await zf(page, 'PUT', '/crm/v8/Leads', Object.assign({ data: [Object.assign({ id }, rec)] }, ex)); return r.s + ' ' + r.t.slice(0, 260); };
  const out = {};
  out.updBadDefault = await put('7687862000000765080', { QA_VR1112_Code: 'X' });
  out.updBadAfe = await put('7687862000000765084', { QA_VR1112_Code: 'X', Designation: 'QA' }, afe); // already X, but code in payload
  out.G3_otherFieldAfe = await put('7687862000000765076', { Designation: 'QA other field' }, afe);
  const fa = { api_name: 'QA_VR1112_Code', id: '7687862000000765060' };
  const r2 = await zf(page, 'POST', '/crm/v8/settings/validation_rules?module=Leads&layout_id='+L, { validation_rules: [{ name: 'QA VR1112 R2', field: fa, type: 'field_rule', conditions: [{ sequence_number: 1, primary_condition: { comparator: 'not_contains', field: fa, value: 'X' }, alert: 'QA VR1112 R2 not contains' }] }] });
  out.H1_r2 = r2.s + ' ' + r2.t.slice(0, 500);
  return out;
}
