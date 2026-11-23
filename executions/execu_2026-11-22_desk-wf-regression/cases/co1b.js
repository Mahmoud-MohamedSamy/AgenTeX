// CO batch 1: each operator = 1 rule (On Create, or On Edit for "changed"), a matching ticket M and a non-matching ticket N.
const mark = FU({ qa_ndc_company_name: 'WFHIT' });
const D = d => TS(d + 'T00:00:00'), DTV = d => TS(d);
const btw = (f, lo, hi) => AND(cmp(f, 'GreaterThanOrEqual', lo), cmp(f, 'LessThanOrEqual', hi));
const nbtw = (f, lo, hi) => OR(cmp(f, 'LessThan', lo), cmp(f, 'GreaterThan', hi));
const tf = 'qa_ndc_agency_code', nf = 'qa_ndc_agent_id', cb = 'checkbox_displayed_by_layout_rules', df = 'qa_ndc_issue_date', dt = 'due_date';
// [id, label, criteria, M values, N values, edit]  edit: {M:{...}, N:{...}} applied after create (On Edit rule)
const C = [
 ['T1', 'text equals', cmp(tf, 'Equal', S('ABC')), { [tf]: 'ABC' }, { [tf]: 'XYZ' }],
 ['T2', 'text does not equal', cmp(tf, 'NotEqual', S('ABC')), { [tf]: 'XYZ' }, { [tf]: 'ABC' }],
 ['T3', 'text contains', sm(tf, 'Contains', 'BC'), { [tf]: 'ABCD' }, { [tf]: 'XYZ' }],
 ['T4', 'text does not contain', NOT(sm(tf, 'Contains', 'BC')), { [tf]: 'XYZ' }, { [tf]: 'ABCD' }],
 ['DT1', 'date-time on (same instant)', cmp(dt, 'Equal', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T10:00:00+02:00' }, { [dt]: '2026-12-11T10:00:00+02:00' }],
 ['DT2', 'date-time after', cmp(dt, 'GreaterThan', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T11:00:00+02:00' }, { [dt]: '2026-12-10T09:00:00+02:00' }],
 ['DT3', 'date-time on or after', cmp(dt, 'GreaterThanOrEqual', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T10:00:00+02:00' }, { [dt]: '2026-12-10T09:59:00+02:00' }],
 ['DT4', 'date-time before', cmp(dt, 'LessThan', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T09:00:00+02:00' }, { [dt]: '2026-12-10T11:00:00+02:00' }],
 ['DT5', 'date-time on or before', cmp(dt, 'LessThanOrEqual', DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T10:00:00+02:00' }, { [dt]: '2026-12-10T10:01:00+02:00' }],
 ['DT6', 'date-time between', btw(dt, DTV('2026-12-10T08:00:00'), DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T09:00:00+02:00' }, { [dt]: '2026-12-10T11:00:00+02:00' }],
 ['DT7', 'date-time not between', nbtw(dt, DTV('2026-12-10T08:00:00'), DTV('2026-12-10T10:00:00')), { [dt]: '2026-12-10T11:00:00+02:00' }, { [dt]: '2026-12-10T09:00:00+02:00' }],
];
const st = [];
for (const [id, label, crit, M, N, edit] of C) {
  const tag = 'CO' + id + 'b'; const r = await mkRule(tag, { kind: edit ? 'RecordUpdated' : 'RecordCreated' }, [mark], { criteria: crit });
  st.push({ id, label, tag, r, M, N, edit });
}
for (const x of st) { if (!x.r.id) continue; x.tm = await mkTicket(x.tag, x.M, 'M'); if (x.N) x.tn = await mkTicket(x.tag, x.N, 'N'); }
await sleep(8000);
for (const x of st) if (x.edit && x.r.id) { await patchTicket(x.tm.id, x.edit.M); await patchTicket(x.tn.id, x.edit.N); }
await sleep(45000);
const out = [];
for (const x of st) {
  if (!x.r.id) { out.push({ id: x.id, label: x.label, verdict: 'SAVE-FAIL', err: x.r.err }); continue; }
  const m = x.tm.id ? await fired(x.tm.id, x.r.id) : 'tkt ' + x.tm.err; const n = x.tn ? (x.tn.id ? await fired(x.tn.id, x.r.id) : 'tkt ' + x.tn.err) : '-';
  out.push({ id: x.id, label: x.label, M: m, N: n, verdict: m === 1 && (n === 0 || n === '-') ? 'PASS' : 'CHECK' });
}
fs.writeFileSync(RUN + '/out/co1b.json', JSON.stringify(out, null, 1));
return out.filter(o => o.verdict !== 'PASS').concat([{ pass: out.filter(o => o.verdict === 'PASS').length, total: out.length }]);
