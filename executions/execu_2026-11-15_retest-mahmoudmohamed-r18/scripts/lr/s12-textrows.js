const mid = await modId(); const f = x => FP + x; const g = (await getRule(mid, I.rBasic)).j.data;
g.branches = g.branches.slice(0, 3).concat([br({ op: 'and', children: [eq(f('type'), 'Partner'), { op: 'startsWith', field: f('text'), value: 'QA' }, { op: 'gt', field: f('amount'), value: 5 }, { op: 'gt', field: f('date'), value: '2026-01-01' }, { op: 'isNotEmpty', field: f('email2') }] }, [req([f('reason')])])]);
const u = await putRule(mid, I.rBasic, g); return { put: SR(u).slice(0, 400), n: (await getRule(mid, I.rBasic)).j.data.branches.length };
