const out = {};
// K1 (2935)
const f1 = await mkField('qa_rt18sr_num', 'number'); out.k1field = SR(f1);
let r = await mkRule({ name: P + 'K1', entries: [ent('qa_rt18sr_num', 'gte', 5, 9)] }); const k1 = r.j && r.j.data && r.j.data.id; out.k1rule = SR(r);
const rec1 = await mkRec({ last_name: P + 'K1 lead', qa_rt18sr_num: 6 }); out.k1score0 = await score(rec1.id);
const del = await api('DELETE', '/modules/' + L + '/fields/' + f1.id); out.k1delete = SR(del) + ' ' + String(del.t).slice(0, 300);
const fAfter = (await fieldsOf(L)).find(x => x.fieldName === 'qa_rt18sr_num'); out.k1fieldStill = !!fAfter;
const g = await getRule(k1); out.k1ruleAfter = g.s + ' ' + JSON.stringify(g.j && g.j.data).slice(0, 500);
const u = await updRec(rec1.id, { first_name: 'k1' }); out.k1save = u.s + ' score ' + (await score(rec1.id));
// K2 (2936)
const f2 = await mkField('qa_rt18sr_pl', 'pick_list', ['Alpha', 'Beta']); out.k2field = SR(f2);
r = await mkRule({ name: P + 'K2', entries: [ent('qa_rt18sr_pl', 'eq', 'Alpha', 4)] }); const k2 = r.j && r.j.data && r.j.data.id; out.k2rule = SR(r);
const rec2 = await mkRec({ last_name: P + 'K2 lead', qa_rt18sr_pl: 'Alpha' }); out.k2score0 = await score(rec2.id);
const f = (await fieldsOf(L)).find(x => x.id === f2.id);
let upf = await api('PUT', '/modules/' + L + '/fields/' + f2.id, { ...f, datatypeOptions: { allowed_values: ['Beta', 'Gamma'] }, config: { ...(f.config || {}), allowed_values: ['Beta', 'Gamma'] } });
out.k2put = SR(upf) + ' ' + String(upf.t).slice(0, 300);
if (upf.s >= 400 && !/SCORING|scoring|rule/i.test(upf.t)) { upf = await api('PATCH', '/modules/' + L + '/fields/' + f2.id, { datatypeOptions: { allowed_values: ['Beta', 'Gamma'] }, config: { allowed_values: ['Beta', 'Gamma'] }, rowVersion: f.rowVersion }); out.k2patch = SR(upf) + ' ' + String(upf.t).slice(0, 300); }
const f2a = (await fieldsOf(L)).find(x => x.id === f2.id); out.k2valsAfter = JSON.stringify((f2a.config || {}).allowed_values || f2a.datatypeOptions);
const g2 = await getRule(k2); out.k2ruleAfter = g2.s + ' ' + JSON.stringify(g2.j && g2.j.data).slice(0, 500);
const u2 = await updRec(rec2.id, { first_name: 'k2' }); out.k2save = u2.s + ' score ' + (await score(rec2.id));
I.k1 = { rule: k1, field: f1.id, rec: rec1.id }; I.k2 = { rule: k2, field: f2.id, rec: rec2.id }; SAVE();
return out;
