const ds = null; const o = { t: new Date().toISOString() };
const q = await api('POST', '/reporting/reports/' + I.rep + '/query', {}); const m = q.t.match(/QA RT21 SC A",(-?\d+)/); o.rep = m ? +m[1] : q.s; o.rec = await score(I.A); return o;
