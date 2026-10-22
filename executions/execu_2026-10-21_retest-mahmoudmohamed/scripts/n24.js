const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const lay = (await api('GET', `/modules/${L}/layouts`)).j.data.find(l => l.name === 'FieldPermissions');
const s = JSON.stringify(lay);
const one = await api('GET', `/modules/${L}/layouts/${lay.id}`);
const s2 = one.t;
return done({ keys: Object.keys(lay), inList: s.includes('6a570979'), inOne: one.s + ' ' + (s2.includes('6a570979') || s2.includes('qa_rt_rollup')), createLen: JSON.stringify(lay.views?.CREATE || '').length, upd: lay.updatedAt, rv: lay.rowVersion, oneUpd: one.j?.data?.updatedAt });
