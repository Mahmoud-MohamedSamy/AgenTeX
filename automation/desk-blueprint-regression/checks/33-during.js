// TU — transition During items, run through the API as the owner (agent-access variants marked).
const one = async (tg, during, extra = {}) => { const m = await mkBp(DEF(tg, S3(), [TR('go', 'Open', 'Escalated', { during, ...extra }), TR('end', 'Escalated', 'Closed')])); const t = m.ok ? await mkT(tg) : null; if (t) await waitIn(t); return { m, t }; };
// TU-01 no items
{ const g = 'TU1' + uid(); const { t } = await one(g, {}); const tr = (await trans(t))[0]; const r = await runT(t, 'go'); R('TU-01', ok(r) ? 'PASS' : 'FAIL', `run with nothing filled → ${E(r)}; transition offers during ${JSON.stringify(tr?.during || {}).slice(0, 80)}`); }
// TU-02 reply required
{ const g = 'TU2' + uid(); const { t } = await one(g, { deskItems: [{ kind: 'reply', mandatory: true }] });
  const r0 = await runT(t, 'go'); const r1 = await runT(t, 'go', 'Open', { reply: { content: 'QA BP R reply to contact' } }); await sleep(2000);
  const th = (await api('GET', `/desk/tickets/${t}/threads`)).j?.data; const thTxt = JSON.stringify(th || '').includes('QA BP R reply to contact');
  R('TU-02', code(r0) && ok(r1) && r1.j?.data?.reply_id && st(await bstate(t)) === 'Escalated' ? 'PASS' : 'FAIL', `without reply → ${E(r0)}; with reply → ${E(r1)} reply_id ${!!r1.j?.data?.reply_id}; reply in threads ${thTxt}`); }
// TU-03 comment required
{ const g = 'TU3' + uid(); const { t } = await one(g, { deskItems: [{ kind: 'comment', mandatory: true }] });
  const r0 = await runT(t, 'go'); const r1 = await runT(t, 'go', 'Open', { comment: { content: 'QA BP R private note' } }); await sleep(1500);
  const cm = JSON.stringify((await api('GET', `/desk/tickets/${t}/comments`)).j?.data || '');
  R('TU-03', code(r0) && ok(r1) && r1.j?.data?.comment_id ? 'PASS' : 'FAIL', `without → ${E(r0)}; with → ${E(r1)}; comment stored ${cm.includes('QA BP R private note')}, private ${/"is_public":false|"visibility":"private"|"private":true/.test(cm) || 'n/a'}`); }
// TU-04 attachment required (NDC-2753)
{ const g = 'TU4' + uid(); const { t } = await one(g, { deskItems: [{ kind: 'attachment', mandatory: true }] });
  const r0 = await runT(t, 'go'); const f = await upload('qa-bp-r-tu4.txt');
  const r1 = f.id ? await runT(t, 'go', 'Open', { attachment_ids: [f.id] }) : { s: 0, t: 'upload failed ' + JSON.stringify(f) };
  await sleep(1500); const att = JSON.stringify((await api('GET', `/desk/tickets/${t}/attachments`)).j?.data || '');
  both('TU-04', 'NDC-2753', !!code(r0) && ok(r1), `without file → ${E(r0)}; upload ${JSON.stringify(f)}; with file → ${E(r1)}; file listed on ticket ${att.includes(f.id || 'none') || att.includes('qa-bp-r-tu4')}`); }
// TU-05 resolution required
{ const g = 'TU5' + uid(); const { t } = await one(g, { deskItems: [{ kind: 'resolution', mandatory: true }] });
  const r0 = await runT(t, 'go'); const r1 = await runT(t, 'go', 'Open', { resolution: { content: 'QA BP R resolved by step' } }); await sleep(1500);
  const res = (await flds(t)).resolution;
  R('TU-05', !!code(r0) && ok(r1) && /QA BP R resolved/.test(res || JSON.stringify((await api('GET', `/desk/tickets/${t}/resolution`)).j?.data || '')) ? 'PASS' : 'FAIL', `without → ${E(r0)}; with → ${E(r1)} resolution_set ${r1.j?.data?.resolution_set}; ticket resolution ${String(res).slice(0, 60)}`); }
// TU-06..21 field item types
const fields = L((await api('GET', `/modules/${T}/fields`)).j?.data);
const fname = f => f.fieldName || f.name; const ftype = f => f.datatypeKey || f.datatype?.key;
const danger = /^(is_spam|is_archived|pending_review|status|department|subject|owner|team|ticket_number|sla_|first_response|resolution_time|closed_time|customer_responded|happiness|approval_status|ticket_approval_status|shared_departments|skills|created|modified|__)/;
const pickType = (types, pref) => { const c = fields.filter(f => types.includes(ftype(f)) && !danger.test(fname(f)) && !f.isSystemManaged); return c.find(f => pref && pref.test(fname(f))) || c.find(f => /^qa_/.test(fname(f))) || c[0]; };
const allowed = f => f?.datatypeOptions?.allowed_values || (f?.datatypeOptions?.options || []).map(o => o.value || o);
const TYPES = [
  ['TU-06', 'single line', ['single_line'], () => 'QA BP R text', () => 'x'.repeat(5000)],
  ['TU-07', 'multi line', ['multi_line'], () => 'QA BP R line 1\nline 2', null],
  ['TU-08', 'number', ['number', 'long_integer'], () => 42, () => 'abc'],
  ['TU-09', 'decimal / currency', ['decimal', 'currency'], () => 12.5, () => 'x1'],
  ['TU-10', 'date', ['date'], () => '2026-12-01', () => '2026-13-45'],
  ['TU-11', 'date-time', ['date_time'], () => '2026-12-01T10:00:00Z', () => 'tomorrow'],
  ['TU-12', 'pick list', ['pick_list'], f => allowed(f)[0], () => 'zzz-not-an-option'],
  ['TU-13', 'multi-select', ['multi_select'], f => [allowed(f)[0]].filter(Boolean), () => ['zzz-not-an-option']],
  ['TU-14', 'checkbox', ['checkbox'], () => true, () => 'maybe'],
  ['TU-15', 'email', ['email'], () => 'qa-bp-r@example.com', () => 'not-an-email'],
  ['TU-16', 'phone', ['phone'], () => '+201001234567', () => 'abc-phone'],
  ['TU-17', 'URL', ['url', 'website'], () => 'https://example.com/qa', () => 'not a url'],
  ['TU-18', 'lookup (Contact)', ['lookup'], () => CONTACT, () => crypto.randomUUID()],
  ['TU-19', 'user', ['user'], () => U.A, () => crypto.randomUUID()],
  ['TU-20', 'address', ['address'], () => ({ street: 'QA BP R 1 Street', city: 'Cairo', country: 'Egypt', postal_code: '11511' }), null],
  ['TU-21', 'formula (read-only)', ['formula'], () => 1, null],
];
const prefs = { 'TU-18': /^contact_id$/, 'TU-19': /^followers$|qa/, 'TU-12': /^category$|qa_ndc/ };
for (const [id, label, types, good, bad] of TYPES) {
  const f = pickType(types, prefs[id]);
  if (!f) { R(id, id === 'TU-21' ? 'BLOCKED' : 'BLOCKED', `no ${label} field on Desk tickets (types ${types.join('/')}); ${id === 'TU-21' ? 'NDC-3217 needs a formula field — see TF-12' : ''}`); continue; }
  const n = fname(f), g = 'TUF' + uid();
  const m = await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { during: { requiredFields: [{ name: n, required: true, datatype: { key: ftype(f) } }] } }), TR('end', 'Escalated', 'Closed')]));
  if (!m.ok) { R(id, id === 'TU-21' ? 'PASS' : 'FAIL', `${label} field ${n} as required item: save → ${E(m.r)}`); continue; }
  const t = await mkT(g, id); await waitIn(t);
  const r0 = await runT(t, 'go');
  const rb = bad ? await runT(t, 'go', 'Open', { fields: { [n]: bad(f) } }) : null;
  const gv = good(f); const r1 = await runT(t, 'go', 'Open', { fields: { [n]: gv } }); await sleep(1500);
  const saved = (await flds(t))[n];
  const h = await histTxt(t); const inHist = h.includes(n);
  const savedOk = JSON.stringify(saved ?? null).toLowerCase().includes(String(Array.isArray(gv) ? gv[0] : typeof gv === 'object' ? gv.city : gv).toLowerCase().slice(0, 10));
  const verdict = !!code(r0) && (!rb || rb.s >= 400) && ok(r1) && savedOk ? 'PASS' : (ok(r1) && savedOk ? 'FAIL' : 'FAIL');
  R(id, id === 'TU-21' ? (ok(r1) ? 'FAIL' : 'PASS') : verdict, `${label} field "${n}": empty → ${E(r0)}; invalid → ${rb ? E(rb) : 'n/a'}; valid → ${E(r1)}; saved ${JSON.stringify(saved).slice(0, 80)}; history mentions field ${inHist}`);
  if (id === 'TU-18') RG('NDC-3060', 'INCONCLUSIVE', 'Contact name vs id is a screen check (Phase 3); API saved ' + JSON.stringify(saved).slice(0, 60));
  if (id === 'TU-20') RG('NDC-3033', inHist ? 'INCONCLUSIVE' : 'INCONCLUSIVE', 'address readable in History is a screen check (Phase 3)');
}
// TU-22 field checks (condition + message)
{ const nf = pickType(['number', 'long_integer']); const n = fname(nf); const g = 'TU22' + uid();
  const rule = { kind: 'Comparison', field: n, operator: 'GreaterThan', value: { kind: 'number', numberValue: 10 } };
  const m = await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { during: { requiredFields: [{ name: n, required: true, datatype: { key: ftype(nf) } }], fieldValidations: [{ field: n, rule, message: 'QA BP R must be more than 10' }] } }), TR('end', 'Escalated', 'Closed')]));
  const noMsg = await mkBp(DEF(g + 'x', S3(), [TR('go', 'Open', 'Escalated', { during: { fieldValidations: [{ field: n, rule, message: '' }] } }), TR('end', 'Escalated', 'Closed')]), false);
  if (m.ok) { const t = await mkT(g); await waitIn(t); const r5 = await runT(t, 'go', 'Open', { fields: { [n]: 5 } }); const r20 = await runT(t, 'go', 'Open', { fields: { [n]: 20 } });
    R('TU-22', r5.s >= 400 && /more than 10/.test(r5.t) && ok(r20) && !noMsg.ok ? 'PASS' : 'FAIL', `${n} = 5 → ${E(r5)}; = 20 → ${E(r20)}; check without message: ${noMsg.ok ? 'SAVED' : 'refused ' + code(noMsg.r)}`); }
  else R('TU-22', 'FAIL', 'field check not accepted: ' + E(m.r)); }
// TU-24 checklist mandatory + optional
{ const g = 'TU24' + uid(); const { t } = await one(g, { checklist: [{ id: 'k1', label: 'QA one', mandatory: true }, { id: 'k2', label: 'QA two', mandatory: true }, { id: 'k3', label: 'QA opt', mandatory: false }] });
  const r1 = await runT(t, 'go', 'Open', { checklist: { k1: true } }); const r2 = await runT(t, 'go', 'Open', { checklist: { k1: true, k2: true } });
  R('TU-24', r1.s >= 400 && ok(r2) ? 'PASS' : 'FAIL', `one of two mandatory → ${E(r1)}; both (optional left) → ${E(r2)}`); }
// TU-25 message item
{ const g = 'TU25' + uid(); const { t } = await one(g, { messages: [{ id: 'm1', text: 'QA BP R read this first' }] });
  const tr = (await trans(t))[0]; R('TU-25', JSON.stringify(tr).includes('QA BP R read this first') && ok(await runT(t, 'go')) ? 'PASS' : 'FAIL', 'message delivered with the transition: ' + JSON.stringify(tr?.during?.messages || tr?.desk_items || '').slice(0, 120)); }
// TU-26/28 approval item
{ const g = 'TU26' + uid(); const { m, t } = await one(g, { deskItems: [{ kind: 'approval', mandatory: true, approverUserIds: [U.B], decideWithinHours: 24 }] });
  if (t) {
    const r0 = await runT(t, 'go');
    const r1 = await runT(t, 'go', 'Open', { approval: { subject: 'QA BP R approve please', approver_user_ids: [U.B], decide_within_hours: 24 } }); await sleep(2500);
    const aid = r1.j?.data?.approval_id; const s1 = st(await bstate(t));
    const other = await runT(t, 'go', s1);
    const d = aid ? await decide(t, aid, 'approve', B) : { s: 0 }; await sleep(5000); const s2 = st(await bstate(t));
    R('TU-26', !!code(r0) && ok(r1) && !!aid && ok(d) ? 'PASS' : 'FAIL', `without approval → ${E(r0)}; with → ${E(r1)} approval ${!!aid}; state after request ${s1}; another run while pending → ${E(other)}; B approves → ${E(d)}; state after approval ${s2}`);
    // rejected
    const t2 = await mkT(g, 'reject'); await waitIn(t2);
    const q = await runT(t2, 'go', 'Open', { approval: { subject: 'QA BP R reject', approver_user_ids: [U.B] } }); await sleep(2500); const a2 = q.j?.data?.approval_id;
    const dr = a2 ? await decide(t2, a2, 'reject', B) : { s: 0 }; await sleep(4000);
    R('TU-28', ok(dr) ? 'PASS' : 'FAIL', `rejected approval → ${E(dr)}; ticket state now ${st(await bstate(t2))}; runs again possible: ${(await transIds(t2)).join(',')}`);
  } else R('TU-26', 'FAIL', 'approval item not saved: ' + E(m.r)); }
// TU-27 approval with a team of another department / unknown team / >10 approvers
{ const teams = (await api('GET', '/desk/teams')).j?.data?.teams || []; const otherTeam = teams.find(x => x.department_id === TECH);
  const ap = async x => { const m = await mkBp(DEF('TU27' + uid(), S3(), [TR('go', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'approval', mandatory: true, ...x }] } }), TR('end', 'Escalated', 'Closed')]), false); return m.ok ? 'SAVED' : code(m.r) + ' ' + (m.r.j?.error?.message || '').slice(0, 60); };
  const res = { otherDeptTeam: otherTeam ? await ap({ approverTeamIds: [otherTeam.id] }) : 'no Tech team', unknownTeam: await ap({ approverTeamIds: [crypto.randomUUID()] }), eleven: await ap({ approverUserIds: Array.from({ length: 11 }, () => U.B) }), hours0: await ap({ approverUserIds: [U.B], decideWithinHours: 0 }), hours721: await ap({ approverUserIds: [U.B], decideWithinHours: 721 }) };
  R('TU-27', Object.values(res).every(v => v !== 'SAVED') ? 'PASS' : 'FAIL', JSON.stringify(res)); }
// TU-29 share item
{ const g = 'TU29' + uid(); const { m, t } = await one(g, { deskItems: [{ kind: 'share', mandatory: true, departmentId: TECH, access: 'read_only' }] });
  if (t) { const r0 = await runT(t, 'go'); const r1 = await runT(t, 'go', 'Open', { shares: [{ department_id: TECH, access: 'read_only' }] }); await sleep(2000);
    const sh = L((await api('GET', `/desk/tickets/${t}/shares`)).j?.data).map(s => (s.department_name || s.department_id) + ':' + s.access);
    R('TU-29', !!code(r0) && ok(r1) && sh.some(x => /read_only/.test(x)) ? 'PASS' : 'FAIL', `without share → ${E(r0)}; with Tech read only → ${E(r1)}; shares ${sh.join(', ')}`); }
  else R('TU-29', 'FAIL', 'share item not saved: ' + E(m.r)); }
// TU-30 optional items
{ const g = 'TU30' + uid(); const { t } = await one(g, { deskItems: [{ kind: 'reply', mandatory: false }, { kind: 'comment', mandatory: false }], checklist: [{ id: 'o', label: 'QA opt', mandatory: false }] });
  R('TU-30', ok(await runT(t, 'go')) ? 'PASS' : 'FAIL', 'all-optional step runs with nothing filled'); }
// TU-31 required for some agents only
{ const g = 'TU31' + uid(); const { m, t } = await one(g, { deskItems: [{ kind: 'comment', mandatory: false }], requiredFor: { comment: { userIds: [U.A], teamIds: [] } } });
  if (t) { const sd = (await getBp(m.id)).definition.transitions[0].during; const rA = await runT(t, 'go', 'Open', {}, A); const rB = await runT(t, 'go', 'Open', {}, B);
    R('TU-31', JSON.stringify(sd).includes('requiredFor') && rA.s >= 400 && ok(rB) ? 'PASS' : 'FAIL', `stored ${JSON.stringify(sd.requiredFor || sd.deskItems).slice(0, 120)}; Agent A (required for) without comment → ${E(rA)}; Agent B without → ${E(rB)}`); } }
// TU-32 item order
{ const g = 'TU32' + uid(); const { m, t } = await one(g, { deskItems: [{ kind: 'comment', mandatory: false }, { kind: 'reply', mandatory: false }], checklist: [{ id: 'c', label: 'QA c', mandatory: false }], itemOrder: ['checklist', 'reply', 'comment'] });
  const sd = (await getBp(m.id)).definition.transitions[0].during; const tr = (await trans(t))[0];
  R('TU-32', JSON.stringify(sd.itemOrder) === JSON.stringify(['checklist', 'reply', 'comment']) ? 'PASS' : 'FAIL', `stored itemOrder ${JSON.stringify(sd.itemOrder)}; ticket gets ${JSON.stringify(tr?.during?.itemOrder || tr?.item_order || '').slice(0, 80)} (form order in Phase 3)`); }
// TU-33 access withheld: Tech owner with Restricted access, optional reply / required comment
{ const g = 'TU33' + uid(); const { t } = await one(g, { deskItems: [{ kind: 'reply', mandatory: false }] }, { before: { departmentOwners: [{ departmentId: TECH, access: 'restricted', userIds: [U.C], teamIds: [] }] } });
  await sleep(4000); const tr = (await trans(t, C))[0]; const r1 = await runT(t, 'go', 'Open', { reply: { content: 'QA BP R restricted reply' } }, C); const r2 = ok(r1) ? r1 : await runT(t, 'go', 'Open', {}, C);
  R('TU-33', !!tr && (ok(r2)) ? 'PASS' : 'FAIL', `Restricted Tech owner sees ${tr ? tr.transitionId || tr.id : 'nothing'} (withheld items: ${JSON.stringify(tr?.withheld || tr?.desk_items || '').slice(0, 100)}); run with reply → ${E(r1)}; run without → ${E(r2)}`); }
// TU-34 data classes in comment / resolution
{ const g = 'TU34' + uid(); const { t } = await one(g, { deskItems: [{ kind: 'comment', mandatory: true }, { kind: 'resolution', mandatory: true }] });
  const x = '<img src=x onerror=alert(1)> تجربة 🚀 ' + 'z'.repeat(9000); const r = await runT(t, 'go', 'Open', { comment: { content: x }, resolution: { content: x } });
  const cm = JSON.stringify((await api('GET', `/desk/tickets/${t}/comments`)).j?.data || '');
  R('TU-34', ok(r) || r.s === 422 ? 'PASS' : 'FAIL', `XSS + Arabic + emoji + 9k chars → ${E(r)}; stored comment has payload text ${cm.includes('onerror')} (rendering checked in Phase 3)`); }
return await cleanup();
