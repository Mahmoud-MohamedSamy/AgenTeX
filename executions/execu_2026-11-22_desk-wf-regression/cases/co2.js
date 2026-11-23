// CO batch 2: lookup (contact), user (owner), Tags, department changed; CF related fields. Tickets in DEPT2 (has agents).
const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4', AM = '784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const mark = FU({ qa_ndc_company_name: 'WFHIT' });
const mkRec = async (mid, vals, label) => { const r = await api('POST', `/modules/${mid}/records`, { data: Object.entries(vals).map(([field, x]) => ({ field, value: enc(x) })) }); const id = r.j && r.j.data && r.j.data.id; if (id) ledger(`${label} ${id}`); return { id, err: errOf(r) }; };
const acc = await mkRec(AM, { name: 'QA WF Account', account_name: 'QA WF Account', industry: 'Technology' }, 'account "QA WF Account"');
const c1 = await mkRec(CM, { name: 'QA WF Contact One', last_name: 'QA WF Contact One', email: 'mahmoud.mmohamedsamy+qawf1@gmail.com', title: 'Manager', account_id: acc.id }, 'contact "QA WF Contact One"');
const c2 = await mkRec(CM, { name: 'QA WF Contact Two', last_name: 'QA WF Contact Two', email: 'mahmoud.mmohamedsamy+qawf2@gmail.com', title: 'Clerk' }, 'contact "QA WF Contact Two"');
const tagA = await api('POST', '/desk/tags', { department_id: DEPT2, name: 'QA WF tagA' }); const tagB = await api('POST', '/desk/tags', { department_id: DEPT2, name: 'QA WF tagB' });
const TA = tagA.j && tagA.j.data && tagA.j.data.id, TB = tagB.j && tagB.j.data && tagB.j.data.id; ledger(`tags QA WF tagA ${TA} tagB ${TB}`);
const setup = { acc: acc.id || acc.err, c1: c1.id || c1.err, c2: c2.id || c2.err, TA: TA || tagA.t.slice(0, 200), TB };
if (!c1.id || !TA) return { setup };
const d2 = { department: DEPT2 };
const C = [
 ['L1', 'lookup is', cmp('contact_id', 'Equal', S(c1.id)), { contact_id: c1.id }, { contact_id: c2.id }],
 ['L2', 'lookup is not', cmp('contact_id', 'NotEqual', S(c1.id)), { contact_id: c2.id }, { contact_id: c1.id }],
 ['L3', 'lookup is one of', mem('contact_id', null, [c1.id]), { contact_id: c1.id }, { contact_id: c2.id }],
 ['L4', 'lookup is not one of', { ...mem('contact_id', null, [c1.id]), negate: true }, { contact_id: c2.id }, { contact_id: c1.id }],
 ['L5', 'lookup is empty', ex('contact_id', 'IsNull'), {}, { contact_id: c1.id }],
 ['L6', 'lookup is not empty', ex('contact_id', 'IsNotNull'), { contact_id: c1.id }, {}],
 ['L7', 'lookup changed', changed('contact_id'), { contact_id: c1.id }, { contact_id: c1.id }, { M: { contact_id: c2.id }, N: { priority: 'high' } }],
 ['U1', 'user is', cmp('owner', 'Equal', S(TU1)), { owner: TU1 }, { owner: DEV2 }],
 ['U2', 'user is not', cmp('owner', 'NotEqual', S(TU1)), { owner: DEV2 }, { owner: TU1 }],
 ['U3', 'user is one of', mem('owner', null, [TU1, OWN]), { owner: TU1 }, { owner: DEV2 }],
 ['U4', 'user is not one of', { ...mem('owner', null, [TU1]), negate: true }, { owner: DEV2 }, { owner: TU1 }],
 ['U5', 'user is empty', ex('owner', 'IsNull'), {}, { owner: TU1 }],
 ['U6', 'user is not empty', ex('owner', 'IsNotNull'), { owner: TU1 }, {}],
 ['U7', 'user changed', changed('owner'), { owner: TU1 }, { owner: TU1 }, { M: { owner: DEV2 }, N: { priority: 'high' } }],
 ['U8', 'Created By is (value-only system field)', cmp('created_by', 'Equal', S(OWN)), {}, null],
 ['O7', 'department changed', changed('department'), {}, {}, { M: { department: DEPT }, N: { priority: 'high' } }],
 ['R1', 'related contact_id.title equals Manager', cmp('contact_id.title', 'Equal', S('Manager')), { contact_id: c1.id }, { contact_id: c2.id }],
 ['R2', 'related account_id.industry (ticket account)', cmp('account_id.industry', 'Equal', S('Technology')), { account_id: acc.id }, {}],
 ['R3', 'related field when no contact = empty', ex('contact_id.title', 'IsNull'), {}, { contact_id: c1.id }],
];
// Tags (added after create through the tags endpoint, so On Edit rules + a later edit)
const G = [
 ['G1', 'tags contains any of', mem('tags', null, [TA]), [TA], [TB]],
 ['G2', 'tags contains all of', { ...mem('tags', 'All', [TA, TB]) }, [TA, TB], [TA]],
 ['G3', 'tags contains none of', { ...mem('tags', null, [TA]), negate: true }, [TB], [TA]],
 ['G4', 'tags is empty', ex('tags', 'IsNull'), [], [TA]],
 ['G5', 'tags is not empty', ex('tags', 'IsNotNull'), [TA], []],
];
const st = [];
for (const [id, label, crit, M, N, edit] of C) { const r = await mkRule('CO' + id, { kind: edit ? 'RecordUpdated' : 'RecordCreated' }, [mark], { criteria: crit }); st.push({ id, label, r, M, N, edit }); }
for (const [id, label, crit, M, N] of G) { const r = await mkRule('CO' + id, { kind: 'RecordUpdated' }, [mark], { criteria: crit }); st.push({ id, label, r, M, N, tags: true }); }
for (const x of st) {
  if (!x.r.id) continue;
  if (x.tags) { x.tm = await mkTicket('CO' + x.id, d2, 'M'); x.tn = await mkTicket('CO' + x.id, d2, 'N'); continue; }
  x.tm = await mkTicket('CO' + x.id, { ...d2, ...x.M }, 'M'); if (x.N) x.tn = await mkTicket('CO' + x.id, { ...d2, ...x.N }, 'N');
}
await sleep(8000);
for (const x of st) {
  if (!x.r.id) continue;
  if (x.tags) { if (x.M.length) await api('POST', `/desk/tickets/${x.tm.id}/tags`, { tag_ids: x.M }); if (x.N.length) await api('POST', `/desk/tickets/${x.tn.id}/tags`, { tag_ids: x.N }); await sleep(1500); await patchTicket(x.tm.id, { classification: 'others' }); await patchTicket(x.tn.id, { classification: 'others' }); }
  else if (x.edit) { await patchTicket(x.tm.id, x.edit.M); await patchTicket(x.tn.id, x.edit.N); }
}
await sleep(45000);
const out = [];
for (const x of st) {
  if (!x.r.id) { out.push({ id: x.id, label: x.label, verdict: 'SAVE-FAIL', err: x.r.err }); continue; }
  const m = x.tm.id ? await fired(x.tm.id, x.r.id) : 'tkt ' + x.tm.err; const n = x.tn ? (x.tn.id ? await fired(x.tn.id, x.r.id) : 'tkt ' + x.tn.err) : '-';
  const ok = x.tags ? (m >= 1 && n === 0) : (m === 1 && (n === 0 || n === '-'));
  out.push({ id: x.id, label: x.label, M: m, N: n, verdict: ok ? 'PASS' : 'CHECK' });
}
fs.writeFileSync(RUN + '/out/co2.json', JSON.stringify({ setup, out }, null, 1));
return { setup, notPass: out.filter(o => o.verdict !== 'PASS'), pass: out.filter(o => o.verdict === 'PASS').length, total: out.length };
