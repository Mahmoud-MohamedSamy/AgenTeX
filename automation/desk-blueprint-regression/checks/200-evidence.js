// Fresh repros for the 5 Plane drafts (Customer Support, guard "QA BP R EV…"), raw responses saved for the evidence images.
const CSD = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const EV = {}; const save = () => fs.writeFileSync(RUN + '/evidence/plane-evidence.json', JSON.stringify(EV, null, 1));
const mk = async (tag, states, trs, x = {}) => mkBp({ ...DEF(tag, states, trs, x), departmentId: CSD });
const tk = async (tag, s, extra = {}) => mkT(tag, s, { department: CSD, contact_id: undefined, ...extra });
const short = r => ({ status: r.s, body: r.j ? (r.j.error ? { error: r.j.error } : { data: JS(r.j.data).slice(0, 300) }) : r.t.slice(0, 300) });
// 1 field checks skipped in the transition form
{ const g = 'EV1' + uid();
  await mk(g, S3(), [TR('go', 'Open', 'Escalated', { during: { requiredFields: [{ name: 'qa_ndc_tkt_pnr_no', required: true, datatype: { key: 'single_line' } }, { name: 'category', required: true, datatype: { key: 'pick_list' } }, { name: 'contact_id', required: true, datatype: { key: 'lookup' } }] } }), TR('end', 'Escalated', 'Closed')]);
  const fake = crypto.randomUUID(); const long = 'X'.repeat(400);
  const te = await tk(g, 'normal edit'); await waitIn(te);
  const e1 = await setF(te, { qa_ndc_tkt_pnr_no: long }), e2 = await setF(te, { category: 'zzz-not-an-option' }), e3 = await setF(te, { contact_id: fake });
  const t = await tk(g, 'transition'); await waitIn(t); await api('POST', `/desk/tickets/${t}/assign`, { owner_id: U.B });
  const run = await runT(t, 'go', 'Open', { fields: { qa_ndc_tkt_pnr_no: long, category: 'zzz-not-an-option', contact_id: fake } }); await sleep(2000);
  const f = await flds(t);
  EV.bug1 = { ticket: t, no: f.ticket_number, fake, normalEdit: { tooLong: short(e1), badOption: short(e2), missingContact: short(e3) }, transitionRun: short(run), stored: { pnrLength: String(f.qa_ndc_tkt_pnr_no || '').length, category: f.category, contact_id: f.contact_id, status: f.status } };
  MADE.tickets = MADE.tickets.filter(x => x !== t); keep(); save(); }
// 2 .NET names in errors
{ const g = 'EV2' + uid(); const body = DEF(g, S3(), [TR('go', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'comment', mandatory: true }], requiredFor: { comment: ['x'] } } }), TR('end', 'Escalated', 'Closed')]);
  const r = await api('POST', `/modules/${T}/blueprints`, { definition: { ...body, departmentId: CSD }, isActive: false });
  const owner = await api('POST', `/modules/${T}/blueprints`, { definition: { ...DEF(g + 'o', S3(), [TR('go', 'Open', 'Escalated', { before: { allowedUserIds: ['not-a-uuid'] } }), TR('end', 'Escalated', 'Closed')]), departmentId: CSD }, isActive: false });
  EV.bug2 = { request: 'POST /api/v1/modules/{tickets}/blueprints  …"during": { "requiredFor": { "comment": ["x"] } }', response: short(r), ownerCase: short(owner) }; save(); }
// 3 owner without edit access
{ const g = 'EV3' + uid(); await mk(g, S3(), [{ ...TR('approve', 'Open', 'Escalated', { before: { allowedUserIds: [U.A] } }), name: 'QA Approve' }, TR('end', 'Escalated', 'Closed')]);
  const t = await tk(g, 'owned by B'); await waitIn(t); await api('POST', `/desk/tickets/${t}/assign`, { owner_id: U.B }); await sleep(2500);
  const edit = await setF(t, { description: 'QA edit by A' }, A); const offered = await transIds(t, A); const run = await runT(t, 'approve', 'Open', {}, A);
  EV.bug3 = { ticket: t, no: (await flds(t)).ticket_number, aEdit: short(edit), aOffered: offered, aRun: short(run) };
  MADE.tickets = MADE.tickets.filter(x => x !== t); keep(); save(); }
// 4 workflow log "Fired" while the status change is skipped
{ const g = 'EV4' + uid(); const pre = 'QA BP R ' + g + ' ';
  await mk(g, S3(), [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]);
  const rr = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA BP R ' + g + ' set Closed', isActive: true, mode: 'Recurring', trigger: { kind: 'RecordUpdated' }, criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: pre, caseInsensitive: false }, actions: [{ order: 0, delaySeconds: 0, type: 'FieldUpdate', fieldUpdates: { status: { kind: 'string', stringValue: 'Closed' } } }], departmentIds: [CSD] });
  const rid = rr.j?.data?.id; MADE.temp.push({ kind: 'wfrule', id: rid }); keep();
  const t = await tk(g, 'ticket'); await waitIn(t); await runT(t, 'go'); await sleep(2000); await setF(t, { description: 'QA edit to trigger the rule' }); await sleep(20000);
  const ex = arr((await api('GET', `/workflow/executions?ruleId=${rid}&take=20`)).j?.data).filter(e => e.recordId === t);
  EV.bug4 = { rule: rid, ruleName: 'QA BP R ' + g + ' set Closed', ticket: t, no: (await flds(t)).ticket_number, executions: ex.map(e => ({ outcome: e.outcome || e.status, actions: JS(e.actions || e.actionResults || e.steps || '').slice(0, 300), at: e.createdAt || e.executedAt })), statusAfter: await statusOf(t), stateAfter: st(await bstate(t)) };
  MADE.tickets = MADE.tickets.filter(x => x !== t); keep(); save(); }
// 5 owner under another department who is not its agent
{ const g = 'EV5' + uid();
  const m = await mk(g, S3(), [{ ...TR('review', 'Open', 'Escalated', { before: { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [U.C1], teamIds: [] }] } }), name: 'QA Review' }, TR('end', 'Escalated', 'Closed')]);
  const tech = await deptGet(TECH);
  const t = await tk(g, 'ticket'); await waitIn(t); await sleep(4000);
  const shares = L((await api('GET', `/desk/tickets/${t}/shares`)).j?.data).map(s => (s.department_name || s.department_id) + ':' + s.access);
  const offered = await transIds(t, C1); const run = await runT(t, 'review', 'Open', {}, C1);
  EV.bug5 = { save: short(m.r), userIsTechAgent: tech.agent_user_ids.includes(U.C1), shares, offered, run: short(run), ticket: t, no: (await flds(t)).ticket_number };
  MADE.tickets = MADE.tickets.filter(x => x !== t); keep(); save(); }
return { saved: Object.keys(EV), tickets: { bug1: EV.bug1?.no, bug3: EV.bug3?.no, bug4: EV.bug4?.no, bug5: EV.bug5?.no } };
