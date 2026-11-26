// IN + EN-16 + TF-11 + SM-03 retry + TF id corrections.
const S = v => ({ kind: 'string', stringValue: String(v) });
const guard = p => ({ kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: p, caseInsensitive: false });
const FU = o => ({ type: 'FieldUpdate', fieldUpdates: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'object' ? v : S(v)])) });
const mkRule = async (name, trigger, actions, prefix, extra = {}) => {
  const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA BP R ' + name, isActive: true, mode: 'Recurring', trigger, criteria: guard(prefix), actions: actions.map((a, i) => ({ order: i, delaySeconds: 0, ...a })), departmentIds: [DEPT], ...extra });
  const id = r.j?.data?.id; if (id) { MADE.temp.push({ kind: 'wfrule', id }); keep(); } return { r, id };
};
const execs = async (recordId, ruleId) => arr((await api('GET', `/workflow/executions?ruleId=${ruleId}&take=100`)).j?.data).filter(e => e.recordId === recordId);
const delRule = async id => { await api('DELETE', `/workflow/rules/${id}`); MADE.temp = MADE.temp.filter(x => x.id !== id); keep(); };
// --- corrections of ids used by mistake earlier
R('TF-05', 'PASS', 'webhook after-action arrives with the ticket data (recordId, transition, state); internal / cloud-metadata URLs (169.254.169.254, localhost, 10.x, [::1], metadata.google.internal) are refused at save (NDC-2537 fixed)');
R('TF-X1', 'FINDING', 'create-task after-action with an unknown assignee mode (e.g. "specific") is saved and silently treated as "ticket owner"; valid modes are owner / performer / user / team', { extra: 'not in case list' });
// --- TF-11 workflow rule after transitions with and without required items (NDC-2420)
{ const g = 'WFA' + uid(); const pre = 'QA BP R ' + g + ' ';
  await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('plain', 'Open', 'Escalated'), TR('req', 'Open', 'On Hold', { during: { requiredFields: [{ name: 'qa_ndc_tkt_pnr_no', required: true, datatype: { key: 'single_line' } }] } }), TR('end', 'Escalated', 'Closed'), TR('end2', 'On Hold', 'Closed')]));
  const rule = await mkRule(g + ' on edit', { kind: 'RecordUpdated' }, [FU({ qa_ndc_agency_code: 'QA-WF-RAN' })], pre);
  const a = await mkT(g, 'plain'), b = await mkT(g, 'req'); await waitIn(a); await waitIn(b);
  await runT(a, 'plain'); await runT(b, 'req', 'Open', { fields: { qa_ndc_tkt_pnr_no: 'PNR1' } }); await sleep(20000);
  const fa = await flds(a), fb = await flds(b);
  both('TF-11', 'NDC-2420', fa.qa_ndc_agency_code === 'QA-WF-RAN' && fb.qa_ndc_agency_code === 'QA-WF-RAN', `On Edit rule ${E(rule.r)}: after a transition with no items → ran ${fa.qa_ndc_agency_code === 'QA-WF-RAN'}; after a transition with a required field → ran ${fb.qa_ndc_agency_code === 'QA-WF-RAN'}`);
  await delRule(rule.id); }
// --- IN-01 workflow sets Status on a ticket in a blueprint (instant + delayed) (NDC-2764, NDC-2730)
{ const g = 'WFS' + uid(); const pre = 'QA BP R ' + g + ' ';
  await mkBp(BASIC(g));
  const r1 = await mkRule(g + ' status', { kind: 'RecordUpdated' }, [FU({ status: 'Closed' })], pre);
  const r2 = await mkRule(g + ' status delayed', { kind: 'RecordUpdated' }, [{ ...FU({ status: 'On Hold' }), delaySeconds: 60 }], pre);
  const t = await mkT(g); await waitIn(t); await runT(t, 'go'); await sleep(2000); await setF(t, { description: 'QA trigger edit' }); await sleep(90000);
  const s = await bstate(t), status = await statusOf(t); const e1 = await execs(t, r1.id), e2 = await execs(t, r2.id);
  const outs = [...e1, ...e2].map(e => (e.outcome || e.status) + (e.error ? ':' + JS(e.error).slice(0, 60) : ''));
  const ok1 = st(s) === 'Escalated' && status === 'Escalated';
  R('IN-01', ok1 ? (outs.some(o => /Succeeded|Fired/.test(o) && !/skip|block/i.test(o)) ? 'FINDING' : 'PASS') : 'FAIL', `rules setting Status (instant + 60 s delay) on a ticket in Escalated: blueprint state ${st(s)}, status ${status}; execution outcomes [${outs.join(', ')}]`);
  RG('NDC-2764', ok1 ? 'PASS' : 'FAIL', `ticket stays in its blueprint state (${st(s)}/${status})`);
  RG('NDC-2730', ok1 ? 'PASS' : 'FAIL', 'workflow cannot change the blueprint-locked field');
  await delRule(r1.id); await delRule(r2.id); }
// --- EN-16 workflow on create sets the field the criteria use
{ const g = 'WFC' + uid(); const pre = 'QA BP R ' + g + ' ';
  const rule = await mkRule(g + ' on create', { kind: 'RecordCreated' }, [FU({ priority: 'urgent' })], pre);
  await mkBp({ ...BASIC(g), entryCriteria: { op: 'and', children: [crit(g), { op: 'eq', field: 'priority', value: 'urgent' }] } });
  const t = await mkT(g, 'low', { priority: 'low' }); const s = await waitIn(t, 30);
  R('EN-16', !!s ? 'PASS' : 'FAIL', `ticket created Low; On Create rule sets Urgent; blueprint needs Urgent → entered ${!!s} (priority now ${(await flds(t)).priority})`);
  await delRule(rule.id); }
// --- IN-02 assignment then blueprint with Ticket owner as owner (department round robin)
{ const g = 'RR' + uid(); await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { before: { allowOwner: true } }), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(g); await waitIn(t); let owner = null; for (let i = 0; i < 8 && !owner; i++) { await sleep(3000); owner = (await flds(t)).owner; }
  const who = owner === U.A ? A : owner === U.B ? B : owner === U.owner ? api : null;
  R('IN-02', owner && who ? ((await transIds(t, who)).includes('go') ? 'PASS' : 'FAIL') : 'INCONCLUSIVE', `department round robin gave the ticket to ${owner ? owner.slice(0, 8) : 'nobody (no agent online)'}; that owner can run the Ticket-owner step: ${who ? (await transIds(t, who)).includes('go') : 'n/a'}`); }
// --- IN-05 approval pending + edit does not drop the ticket out (NDC-2334 Desk equivalent)
{ const g = 'APR' + uid(); await mkBp(BASIC(g)); const t = await mkT(g); await waitIn(t);
  const ap = await api('POST', `/desk/tickets/${t}/approvals`, { subject: 'QA BP R approval', approver_user_ids: [U.B] }); await sleep(2000);
  const ed = await setF(t, { description: 'QA edit while approval pending' }); await sleep(3000);
  R('IN-05', ok(ap) && ok(ed) && st(await bstate(t)) === 'Open' ? 'PASS' : 'FAIL', `ticket approval requested → ${E(ap)}; edit → ${E(ed)}; still in blueprint at ${st(await bstate(t))}`);
  RG('NDC-2334', st(await bstate(t)) === 'Open' ? 'PASS' : 'FAIL', 'Desk: edit while an approval is pending keeps the ticket in its blueprint');
  RG('NDC-2707', 'N/A', 'Desk has no record approval process that gates creation; CRM-only (out of scope)'); }
// --- IN-08 status sync after moves (NDC-3135)
{ const g = 'SYN' + uid(); await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Escalated', 'On Hold'), TR('back', 'On Hold', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const bad = []; for (let i = 0; i < 4; i++) { const t = await mkT(g, 's' + i); await waitIn(t); for (const [tid, from] of [['go', 'Open'], ['hold', 'Escalated'], ['back', 'On Hold']]) { await runT(t, tid, from); await sleep(1200); const rec1 = await statusOf(t), dk = (await deskT(t))?.status; if (rec1 !== dk) bad.push(`${i}:${tid} record ${rec1} desk ${dk}`); } }
  both('IN-08', 'NDC-3135', bad.length === 0, `12 moves on 4 tickets: record status vs Desk ticket status mismatches ${bad.length} ${bad.join('; ')}`); }
// --- SM-03 retry with the reply body the Workflow run used
{ const EMAIL = 'mahmoud.mmohamedsamy+qae1@gmail.com'; const rb = { mode: 'reply', to: [EMAIL], subject: 'Re: QA BP R', body_html: '<p>QA BP R reply</p>' };
  const gc = 'SM3C' + uid(); await mkBp(BASIC(gc)); const tc = await mkT(gc); await waitIn(tc); const c0 = await A('POST', `/desk/tickets/${tc}/replies`, rb);
  const g = 'SM3' + uid(); await mkBp({ ...BASIC(g), strictMode: { scope: 'specified', actions: ['reply'] } }); const t = await mkT(g); await waitIn(t); const r = await A('POST', `/desk/tickets/${t}/replies`, rb);
  R('SM-03', ok(c0) ? (r.s >= 400 && /STRICT/.test(JS(r.j)) ? 'PASS' : 'FAIL') : 'INCONCLUSIVE', `control reply → ${E(c0)}; Restrict Specified [replies] reply → ${E(r)}`); }
R('IN-03', 'NOT RUN', 'direct-assignment switch is OFF tenant-wide; order direct → workflow → SLA → RR → blueprint was proven 14 Nov (OR-22) and not changed since');
R('IN-04', 'NOT RUN', 'macro status change: checked on screen in Phase 3 (macro skipped reason "a blueprint controls the ticket\'s status")');
R('IN-06', 'NOT RUN', 'global-set value removal (NDC-2919) changes a shared global set; not run in this pass');
R('IN-07', 'NOT RUN', 'layout rule (NDC-2977) needs a layout rule on a shared ticket layout; not run in this pass');
return await cleanup();
