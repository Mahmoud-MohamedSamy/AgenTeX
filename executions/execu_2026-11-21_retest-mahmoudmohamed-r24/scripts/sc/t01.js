const o = {}; const id = r => r.j && r.j.data && r.j.data.id;
const CO = 'QA RT20 SC co', CTL = 'QA RT20 SC ctl';
let r = await mkRule({ name: P + 'R1 fit', description: 'QA RT20 lane SC', entries: [ent('company', 'eq', CO, 13), ent('no_of_employees', 'gte', 100, 7), ent('lead_status', 'eq', 'Not Interested', -5)] }); o.R1 = SR(r); const R1 = id(r);
r = await mkRule({ name: P + 'R2 rating', entries: [ent('rating', 'eq', 'active', 20)] }); o.R2 = SR(r); const R2 = id(r);
I.R1 = R1; I.R2 = R2; SAVE();
const C = await mkRec({ last_name: P + 'ctl', company: CTL, no_of_employees: 50 });
const A = await mkRec({ last_name: P + 'A', company: CO, no_of_employees: 50 });
const N = await mkRec({ last_name: P + 'N', company: CTL, no_of_employees: 50, lead_status: 'Not Interested' });
I.C = C.id; I.A = A.id; I.N = N.id; SAVE();
await sleep(1500);
const sc = await score(C.id); o.base = sc; const d = async () => (await score(A.id)) - sc;
o.s1_create_company = await d() + ' (exp 13)';
o.s1b_negative_N = (await score(N.id)) - sc + ' (exp -5)';
await updRec(A.id, { no_of_employees: 150 }); o.s2_emp150 = await d() + ' (exp 20)';
await updRec(A.id, { lead_status: 'Not Interested' }); o.s3_negative = await d() + ' (exp 15)';
await updRec(A.id, { rating: 'active' }); o.s4_rule2 = await d() + ' (exp 35)';
await updRec(A.id, { no_of_employees: 99 }); o.s5_boundary99 = await d() + ' (exp 28)';
await updRec(A.id, { no_of_employees: 100 }); o.s5_boundary100 = await d() + ' (exp 35)';
// rule edit
let g = (await getRule(R1)).j.data; const e2 = g.entries.map(e => ({ field_key: e.field_key, operator: e.operator, value: e.value, points: e.field_key === 'company' ? 30 : e.points }));
r = await api('PUT', '/scoring-rules/' + R1, { name: g.name, description: g.description, module_id: L, is_active: true, entries: e2, row_version: g.row_version }); o.s6_edit = SR(r); LED('scoring rule ' + R1 + ' edited company points 13->30');
await sleep(3000); o.s6_noSave = await d() + ' (35 = not rescored; 52 = rescored)';
await updRec(A.id, { title: 'QA RT20 SC t1' }); o.s6_afterSave = await d() + ' (exp 52)';
// deactivate R2
r = await api('PATCH', '/scoring-rules/' + R2 + '/active', { is_active: false }); o.s7_off = SR(r); LED('scoring rule ' + R2 + ' deactivated');
await sleep(3000); o.s7_offNoSave = await d() + ' (52 kept / 32 removed)';
await updRec(A.id, { title: 'QA RT20 SC t2' }); o.s7_offAfterSave = await d() + ' (32 if inactive rule ignored)';
r = await api('PATCH', '/scoring-rules/' + R2 + '/active', { is_active: true }); await updRec(A.id, { title: 'QA RT20 SC t3' }); o.s8_onAgain = await d() + ' (exp 52)';
// third rule, overlap (multiple rules on same field)
r = await mkRule({ name: P + 'R3 emp', entries: [ent('no_of_employees', 'between', [1, 500], 4)] }); o.R3_between = SR(r).slice(0, 160);
r = await mkRule({ name: P + 'R3 emp', entries: [ent('no_of_employees', 'lt', 500, 4), ent('no_of_employees', 'gt', 10, 1)] }); o.R3 = SR(r); I.R3 = id(r); SAVE();
await updRec(A.id, { title: 'QA RT20 SC t4' }); o.s9_threeRules = await d() + ' (exp 52+5=57; ctl also gets +5 unless saved: ctl not saved)';
o.ctl_before_save = await score(C.id) - sc; await updRec(C.id, { title: 'QA RT20 SC t4' }); o.ctl_after_save = (await score(C.id)) - sc + ' (exp 5)';
o.ruleList = (await listRules()).filter(x => x.name.startsWith(P)).map(x => x.name + ':' + x.is_active + ':' + x.entry_count);
return o;
