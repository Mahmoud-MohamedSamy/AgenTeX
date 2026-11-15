const mid = await modId(); const f = x => FP + x; const g = (await getRule(mid, I.rRadio)).j.data;
g.branches = g.branches.slice(0, 2).concat([br({ op: 'and', children: [eq(f('radio'), 'No'), { op: 'isNotEmpty', field: f('email2') }] }, [show([f('tmp')])])]);
const u = await putRule(mid, I.rRadio, g); const b = (await getRule(mid, I.rRadio)).j.data;
return { put: SR(u).slice(0, 300), rows: b.branches.map(x => JSON.stringify(x.condition) + ' => ' + JSON.stringify(x.actions)) };
