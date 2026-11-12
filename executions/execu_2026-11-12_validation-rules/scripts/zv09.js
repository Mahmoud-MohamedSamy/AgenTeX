async (page, ctx, h) => {
  const L='7687862000000091055';
  const fa = { api_name: 'QA_VR1112_Code', id: '7687862000000765060' };
  const out = {};
  const upd = async (conds) => { const r = await zf(page, 'PUT', '/crm/v8/settings/validation_rules/7687862000000765070?module=Leads&layout_id='+L, { validation_rules: [{ id: '7687862000000765070', name: 'QA VR1112 R1', field: fa, conditions: conds }] }); return r.s + ' ' + r.t.slice(0, 500); };
  out.badComp = await upd([{ sequence_number: 1, primary_condition: { comparator: 'zzz', field: fa, value: 'X' }, alert: 'a' }]);
  out.two = await upd([
    { id: '7687862000000765068', sequence_number: 1, primary_condition: { comparator: 'equal', field: fa, value: 'X' }, alert: 'QA VR1112 C1 equals X' },
    { sequence_number: 2, primary_condition: { comparator: 'not_contains', field: fa, value: 'OK' }, alert: 'QA VR1112 C2 not contains OK' }]);
  return out;
}
