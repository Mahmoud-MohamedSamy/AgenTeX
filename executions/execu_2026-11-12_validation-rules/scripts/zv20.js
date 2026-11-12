async (page, ctx, h) => {
  const L='7687862000000091055', RID='7687862000000765070';
  const fa = { api_name: 'QA_VR1112_Code', id: '7687862000000765060' };
  const c1 = { id: '7687862000000765068', sequence_number: 1, primary_condition: { comparator: 'equal', field: fa, value: 'X' }, alert: 'QA VR1112 C1 equals X' };
  const upd = async (c2) => { const r = await zf(page, 'PUT', '/crm/v8/settings/validation_rules/'+RID+'?module=Leads&layout_id='+L, { validation_rules: [{ id: RID, field: fa, conditions: c2 ? [c1, c2] : [c1] }] }); return r.s + (r.s>=300 ? ' '+r.t.slice(0, 160) : ''); };
  const out = {};
  for (const cmp of ['not_equal','contains','starts_with','ends_with','matches','not_matches','pattern','regex','is_empty','is_not_empty','like','not_like'])
    out[cmp] = await upd({ sequence_number: 2, primary_condition: { comparator: cmp, field: fa, value: 'OK' }, alert: 'QA VR1112 probe' });
  out.alert101 = await upd({ sequence_number: 2, primary_condition: { comparator: 'not_contains', field: fa, value: 'OK' }, alert: 'A'.repeat(101) });
  out.alert100 = await upd({ sequence_number: 2, primary_condition: { comparator: 'not_contains', field: fa, value: 'OK' }, alert: 'A'.repeat(100) });
  // many conditions
  const many = [c1]; for (let i=2;i<=12;i++) many.push({ sequence_number: i, primary_condition: { comparator: 'equal', field: fa, value: 'V'+i }, alert: 'QA VR1112 c'+i });
  const rm = await zf(page, 'PUT', '/crm/v8/settings/validation_rules/'+RID+'?module=Leads&layout_id='+L, { validation_rules: [{ id: RID, field: fa, conditions: many }] }); out.cond12 = rm.s+' '+rm.t.slice(0,250);
  out.restore = await upd({ sequence_number: 2, primary_condition: { comparator: 'not_contains', field: fa, value: 'OK' }, alert: 'QA VR1112 C2 not contains OK' });
  return out;
}
