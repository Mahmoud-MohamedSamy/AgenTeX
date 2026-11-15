const out = {};
// K1 record score with the kept field
const rec1 = await mkRec({ last_name: P + 'K1 lead', qa_rt18sr_num: 6 }); out.k1rec = rec1.s + ' ' + rec1.err; out.k1score = await score(rec1.id);
// K2: field already has Beta,Gamma; rule stores Alpha. Fresh repeat: new pick list 2
const f2 = await mkField('qa_rt18sr_pl2', 'pick_list', ['Alpha', 'Beta']); out.f = SR(f2);
let r = await mkRule({ name: P + 'K2b', entries: [ent('qa_rt18sr_pl2', 'eq', 'Alpha', 4)] }); const k2 = r.j && r.j.data && r.j.data.id; out.rule = SR(r);
const rec2 = await mkRec({ last_name: P + 'K2 lead', qa_rt18sr_pl2: 'Alpha' }); out.k2rec = rec2.s + ' ' + rec2.err; out.k2score0 = await score(rec2.id);
const f = (await fieldsOf(L)).find(x => x.id === f2.id);
const upf = await api('PUT', '/modules/' + L + '/fields/' + f2.id, { ...f, datatypeOptions: { allowed_values: ['Beta', 'Gamma'] }, config: { ...(f.config || {}), allowed_values: ['Beta', 'Gamma'] } });
out.put = SR(upf) + ' ' + String(upf.t).slice(0, 900);
const f2a = (await fieldsOf(L)).find(x => x.id === f2.id); out.valsAfter = JSON.stringify({ c: f2a.config, d: f2a.datatypeOptions }).slice(0, 500);
const g2 = await getRule(k2); out.ruleAfter = g2.s + ' ' + JSON.stringify(g2.j && g2.j.data).slice(0, 900);
out.recValBefore = (await recVals(rec2.id)).qa_rt18sr_pl2;
const u2 = await updRec(rec2.id, { first_name: 'QA k2' }); out.k2save = u2.s + ' ' + u2.err + ' score ' + (await score(rec2.id));
I.k1.rec = rec1.id; I.k2b = { rule: k2, field: f2.id, rec: rec2.id }; SAVE();
return out;
