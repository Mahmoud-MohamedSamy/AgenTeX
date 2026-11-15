const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const o = {};
const eff = await api('GET', '/modules/' + mid + '/field-permissions/effective'); o.eff = eff.s + ' ' + (JSON.stringify(eff.j && eff.j.data).match(/"qa_rt18_date":"?[a-z_]*/) || [''])[0];
const r = await mkRec(mid, { first_name: 'QA', last_name: P + ' 2985 timeline' }, '65062122-a015-4101-abed-c6b1f53913ea'); o.rec = r.s + ' ' + r.id + ' ' + r.err.slice(0, 200);
if (r.id) { I.r2985 = r.id; SAVE(); }
return o;
