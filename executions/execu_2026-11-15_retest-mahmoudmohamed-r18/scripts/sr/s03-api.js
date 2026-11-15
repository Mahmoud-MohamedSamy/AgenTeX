const out = {};
// H2 (2939)
let r = await mkRule({ name: P + 'H2', entries: [ent('lead_source', 'eq', 'web', 1)] }); const h = r.j.data.id;
const g = (await getRule(h)).j.data; const b = pts => ({ name: g.name, is_active: true, entries: g.entries.map(e => ({ id: e.id, field_key: e.field_key, operator: e.operator, value: e.value, points: pts })) });
const t1 = await api('PUT', '/scoring-rules/' + h, { ...b(5), row_version: g.row_version }); const v1 = (await getRule(h)).j.data;
const t3 = await api('PUT', '/scoring-rules/' + h, { ...b(3) }); const v3 = (await getRule(h)).j.data;
const t2 = await api('PUT', '/scoring-rules/' + h, { ...b(9), row_version: g.row_version }); const v2 = (await getRule(h)).j.data;
out.H2 = { fresh: SR(t1) + ' v' + v1.row_version + ' pts ' + v1.entries[0].points, noVersion: SR(t3) + ' -> pts ' + v3.entries[0].points + ' v' + v3.row_version, stale: SR(t2) + ' -> pts ' + v2.entries[0].points };
// H4 (2940)
const [d1, d2] = await Promise.all([mkRule({ name: P + 'dbl', entries: [ent('lead_source', 'eq', 'web', 1)] }), mkRule({ name: P + 'dbl', entries: [ent('lead_source', 'eq', 'web', 1)] })]);
const cnt = (await listRules()).filter(x => x.name === P + 'dbl').length;
const [e1, e2, e3] = await Promise.all([1, 2, 3].map(() => mkRule({ name: P + 'dbl3', entries: [ent('lead_source', 'eq', 'web', 1)] })));
const cnt3 = (await listRules()).filter(x => x.name === P + 'dbl3').length;
const seq = await mkRule({ name: P + 'dbl', entries: [ent('lead_source', 'eq', 'web', 1)] });
out.H4 = { pair: SR(d1) + ' / ' + SR(d2) + ' saved=' + cnt, triple: [e1, e2, e3].map(SR).join(' / ') + ' saved=' + cnt3, sequential: SR(seq) };
// C19 (2941)
r = await mkRule({ name: P + 'C19', entries: [ent('lead_source', 'eq', 'chat', 3), ent('lead_source', 'eq', 'chat', 3)] });
out.C19 = { create: SR(r) };
const ld = await mkRec({ last_name: P + 'C19 lead', lead_source: 'chat' }); out.C19.lead = ld.s + ' ' + ld.err; out.C19.score = await score(ld.id);
// differ only in points
const r2 = await mkRule({ name: P + 'C19b', entries: [ent('lead_source', 'eq', 'chat', 3), ent('lead_source', 'eq', 'chat', 5)] }); out.C19.samePtsDiff = SR(r2);
// I6 / D15 (2942)
const t = async (fk, op, val) => { const x = await mkRule({ name: P + 'I6 ' + op + ' ' + fk, entries: [ent(fk, op, val, 1)] }); return fk + ' ' + op + ' ' + JSON.stringify(val) + ' -> ' + SR(x); };
out.I6 = [];
for (const [fk, o, v] of [['company', 'regexMatches', 'Acme.*'], ['company', 'lengthEq', 8], ['company', 'isEmpty', undefined], ['user', 'eq', 'x'], ['owner', 'eq', 'x'], ['company', 'contains', 'Acme'], ['company', 'isNull', undefined], ['user', 'isNotNull', undefined]]) out.I6.push(await t(fk, o, v));
// I3 / B10 (2943)
const ghost = await api('DELETE', '/scoring-rules/00000000-0000-0000-0000-000000000002');
const dd1 = await api('DELETE', '/scoring-rules/' + h); const dd2 = await api('DELETE', '/scoring-rules/' + h);
if (dd1.s < 300) LED('deleted scoring rule QA RT18 SR H2 ' + h + ' (I3 double delete)');
const bm = await api('GET', '/scoring-rules?module_id=00000000-0000-0000-0000-000000000009');
const cm = await api('POST', '/scoring-rules', { module_id: '00000000-0000-0000-0000-000000000009', name: P + 'badmod', is_active: true, entries: [ent('lead_source', 'eq', 'web', 1)] });
out.I3 = { ghostDelete: SR(ghost), deleteTwice: SR(dd1) + ' / ' + SR(dd2), unknownModuleList: SR(bm) + ' ' + String(bm.t).slice(0, 150), unknownModuleCreate: SR(cm) };
I.h4 = [d1, d2, e1, e2, e3, seq].map(x => x.j && x.j.data && x.j.data.id); I.c19 = { rule: r.j && r.j.data && r.j.data.id, lead: ld.id }; SAVE();
return out;
