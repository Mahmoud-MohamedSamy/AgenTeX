const mid = await modId(); const f = x => FP + x; const g = (await getRule(mid, I.rFilter)).j.data;
g.branches = g.branches.slice(0, 1).concat([br(eq(f('filter'), 'Y'), [{ type: 'recommend_value', field: f('amount'), value: 42 }])]);
const u = await putRule(mid, I.rFilter, g); return SR(u).slice(0, 300);
