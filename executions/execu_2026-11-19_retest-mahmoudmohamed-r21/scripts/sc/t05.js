const o = {}; const id = r => r.j && r.j.data && r.j.data.id;
// old record rescore: N exists, new rule on its company not yet saved
const nBefore = await score(I.N);
let r = await mkRule({ name: P + 'R5 old', entries: [ent('lead_status', 'eq', 'Not Interested', 3)] }); I.R5 = id(r); SAVE(); await sleep(6000);
o.oldRecord_noSave = (await score(I.N)) - nBefore + ' (0 = existing records not rescored)';
// delete effect
const aBefore = await score(I.A);
r = await api('DELETE', '/scoring-rules/' + I.R5); o.delR5 = r.s; LED('deleted scoring rule R5 ' + I.R5); await sleep(5000);
o.afterDelete_noSave_N = (await score(I.N)) - nBefore + ' (still 0, N never got R5)';
r = await api('DELETE', '/scoring-rules/' + I.R2); o.delR2 = r.s; LED('deleted scoring rule R2 ' + I.R2); await sleep(5000);
o.afterDeleteR2_noSave_A = (await score(I.A)) - aBefore + ' (0 = deleted points kept until save; -20 = removed)';
await updRec(I.A, { title: 'QA RT20 SC t6' }); o.afterDeleteR2_save_A = (await score(I.A)) - aBefore + ' (exp -20)';
// records query filter + sort
const q = await api('POST', '/modules/' + L + '/records/query', { filter: { kind: 'And', children: [{ kind: 'StartsWith', field: 'last_name', value: 'QA RT20 SC' }, { kind: 'GreaterThanOrEqual', field: 'score', value: 10 }] }, sort: [{ field: 'score', direction: 'desc' }], limit: 50 });
o.query = q.s + ' ' + (q.s < 300 ? JSON.stringify(arr(q.j.data).map(x => { const d = x.data || []; const g = k => { const e = d.find(y => y.field === k); return e && e.value && e.value.value; }; return [g('last_name'), g('score')]; })) : q.t.slice(0, 300));
const q2 = await api('POST', '/modules/' + L + '/records/query', { filter: { kind: 'StartsWith', field: 'last_name', value: 'QA RT20 SC' }, sort: [{ field: 'score', direction: 'asc' }], limit: 50 });
o.queryAsc = q2.s + ' ' + (q2.s < 300 ? JSON.stringify(arr(q2.j.data).map(x => { const d = x.data || []; const e = d.find(y => y.field === 'score'); return e && e.value && e.value.value; })) : q2.t.slice(0, 300));
// all leads scores now
for (const k of ['A', 'C', 'N', 'D']) o['score_' + k] = await score(I[k]);
// contacts / deals have score field
for (const [nm, mid] of [['contacts', '6f553963-01d6-4b68-9fb3-143d23044c41'], ['deals', 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'], ['accounts', 'b2398920-2914-4836-be53-81bd960effea']]) { const fl = await fieldsOf(mid); const s = fl.find(x => x.fieldName === 'score'); const rl = await api('GET', '/scoring-rules?module_id=' + mid); o['mod_' + nm] = (s ? 'score field ' + s.datatypeKey : 'no score field') + '; rules list ' + rl.s + ' n=' + arr(rl.j && rl.j.data).length; }
return o;
