const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const o = {};
const eff = await api('GET', '/modules/' + mid + '/field-permissions/effective'); o.eff = eff.s + ' ' + (JSON.stringify(eff.j && eff.j.data).match(/.{0,30}qa_rt18_date.{0,40}/) || [''])[0];
const v = await recVals(mid, I.r2985); o.recHasDate = 'qa_rt18_date' in v; o.recDate = v.qa_rt18_date;
for (const p of ['/timeline', '/activities', '/activity', '/history', '/audit']) { const r = await api('GET', '/modules/' + mid + '/records/' + I.r2985 + p); o[p] = r.s + ' ' + (r.s === 200 ? (r.t.match(/.{0,120}(2026-05-01|qa_rt18_date|RT18 date).{0,80}/) || ['no date in body: ' + r.t.slice(0, 200)])[0] : ''); }
return o;
