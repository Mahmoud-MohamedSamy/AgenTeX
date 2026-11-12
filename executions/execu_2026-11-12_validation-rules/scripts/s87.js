const mid = await modId(); const id = I.recs[I.recs.length - 1][1];
const g = await api('GET', '/modules/' + mid + '/records/' + id); const rl = (await rules(mid)).filter(r => r.status === 'active').map(r => r.name + ':' + r.primaryField);
return { vals: (g.j.data.data || []).filter(x => /qa_vr_(text|note|pick)/.test(x.field)).map(x => x.field + '=' + x.value.value), activeRules: rl };
