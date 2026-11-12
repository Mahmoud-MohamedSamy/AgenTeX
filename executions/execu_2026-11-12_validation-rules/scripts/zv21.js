async (page, ctx, h) => {
  const L='7687862000000091055', RID='7687862000000765070';
  const fa = { api_name: 'QA_VR1112_Code', id: '7687862000000765060' };
  const g = async () => (await zf(page, 'GET', '/crm/v8/settings/validation_rules/'+RID+'?module=Leads&layout_id='+L)).j.validation_rules[0].conditions;
  const upd = async (c2) => { const cs = await g(); const c1 = { id: cs[0].id, sequence_number: 1, primary_condition: { comparator: 'equal', field: fa, value: 'X' }, alert: 'QA VR1112 C1 equals X' };
    const conds = [c1]; if (c2) conds.push(Object.assign(cs[1] ? { id: cs[1].id } : {}, c2));
    const r = await zf(page, 'PUT', '/crm/v8/settings/validation_rules/'+RID+'?module=Leads&layout_id='+L, { validation_rules: [{ id: RID, field: fa, conditions: conds }] }); return r.s + (r.s>=300 ? ' '+r.t.slice(60, 200) : ''); };
  const out = { now: JSON.stringify(await g()).slice(0, 300) };
  for (const cmp of ['not_equal','contains','starts_with','ends_with','matches','not_matches','pattern','is_empty','is_not_empty','like'])
    out[cmp] = await upd({ sequence_number: 2, primary_condition: { comparator: cmp, field: fa, value: 'OK' }, alert: 'QA VR1112 probe' });
  out.restore = await upd({ sequence_number: 2, primary_condition: { comparator: 'not_contains', field: fa, value: 'OK' }, alert: 'QA VR1112 C2 not contains OK' });
  return out;
}
