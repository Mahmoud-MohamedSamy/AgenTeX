const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const o = {};
const eff = await api('GET', '/modules/' + mid + '/field-permissions/effective'); o.eff = (JSON.stringify(eff.j && eff.j.data).match(/"qa_rt18v_note":"[a-z_]+"/) || ['none'])[0];
const r = await mkRec(mid, { first_name: 'QA', last_name: P + ' H6 user ' + process.env.FPM, qa_rt18v_text: 'fine' }, I.layout); o.user = r.s + ' ' + r.err.slice(0, 200);
const r2 = await mkRec(mid, { first_name: 'QA', last_name: P + ' H6 user bad ' + process.env.FPM, qa_rt18v_text: 'BAD-u1' }, I.layout); o.userOtherRule = r2.s + ' ' + r2.err.slice(0, 160);
return o;
