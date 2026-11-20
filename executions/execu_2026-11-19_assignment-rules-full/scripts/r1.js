const L = []; const FL = (await api('GET', '/desk/assignment-rules/criteria-fields')).j.data.fields;
const sla = FL.filter(f => /sla/i.test(f.key + ' ' + f.label)).map(f => ({ key: f.key, label: f.label, type: f.type, ops: (f.operators || []).map(o => o.key).join(','), opts: JSON.stringify(f.options || (f.operators && f.operators[0] && f.operators[0].options) || []).slice(0, 300) }));
L.push({ sla });
const pol = (await api('GET', '/desk/sla/policies')).j; const P = arr(pol && (pol.data && (pol.data.policies || pol.data))).filter(p => (p.department_ids || [p.department_id]).includes(IDS.DB) || p.department_id === IDS.DB);
L.push({ policiesDB: P.map(p => p.name + ' ' + p.id) });
return L;
