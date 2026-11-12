async (page, ctx, h) => {
  const L='7687862000000091055', RID='7687862000000765070';
  const fa = { api_name: 'QA_VR1112_Code', id: '7687862000000765060' };
  const g = async () => (await zf(page, 'GET', '/crm/v8/settings/validation_rules/'+RID+'?module=Leads&layout_id='+L)).j.validation_rules[0].conditions;
  const tryN = async (n) => { const cs = await g(); const conds = [];
    for (let i=1;i<=n;i++) conds.push(Object.assign(cs[i-1]?{id:cs[i-1].id}:{}, { sequence_number: i, primary_condition: { comparator: i==1?'equal':(i==2?'not_contains':'equal'), field: fa, value: i==1?'X':(i==2?'OK':'V'+i) }, alert: i==1?'QA VR1112 C1 equals X':(i==2?'QA VR1112 C2 not contains OK':'QA VR1112 c'+i) }));
    const r = await zf(page, 'PUT', '/crm/v8/settings/validation_rules/'+RID+'?module=Leads&layout_id='+L, { validation_rules: [{ id: RID, field: fa, conditions: conds }] }); return r.s + (r.s>=300 ? ' '+r.t.slice(25, 90) : ''); };
  const out = {};
  for (const n of [10, 11, 6, 5, 4, 3]) { out['n'+n] = await tryN(n); }
  out.back2 = await tryN(2);
  out.final = (await g()).length;
  return out;
}
