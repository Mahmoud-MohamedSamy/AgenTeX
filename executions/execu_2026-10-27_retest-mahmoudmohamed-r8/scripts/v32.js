const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {}; const enc = v => ({ kind: 'string', value: String(v) });
const lays = arr((await api('GET', `/modules/${L}/layouts`)).j?.data); const wt = lays.find(l => l.name === 'Wonder Travel'); out.wt = wt?.id;
const views = JSON.stringify((await api('GET', `/modules/${L}/layouts/${wt.id}`)).j?.data?.views || {}); out.hasAttachSection = /attach/i.test(views); out.hasSurvey = /survey/i.test(views);
let r = await api('POST', `/modules/${L}/records`, { layout_id: wt.id, data: [['first_name', 'QA RT r8 attach'], ['phone', '01012345693']].map(([f, v]) => ({ field: f, value: enc(v) })) });
out.create = r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 300)); out.id = r.j?.data?.id;
return done(out);
