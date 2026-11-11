const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const r = await api('GET','/modules/'+L+'/views'); const vs = r.j.data.views; const v = vs.find(x => JSON.stringify(x.settings||{}).includes('criteria') || JSON.stringify(x.settings||{}).includes('filters'));
log(vs.length, v && JSON.stringify(v.settings).slice(0,1200), v && v.kind);
