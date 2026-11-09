// NDC-2706: review (QA process, field email) + On Edit workflow (marker) + blueprint (rating) on "QA RT REV 2706" leads; Mass Update the email,
// approve the review → the On Edit rule must run (execution logged, marker set) and the lead continues into the blueprint. 4 runs.
const out = {}; const RP = 'bd081d46-b273-4579-9025-8c6e12c51219', LAY2 = 'b3ab6751-e26a-4641-9dbc-f8737f26c908'; const G = 'QA RT REV 2706';
const offs = [];
const g = (await api('o', 'GET', '/workflow/review-processes/' + RP)).j?.data;
const keep = ['layoutId', 'name', 'description', 'criteria', 'channels', 'fields', 'rules', 'notifications', 'sla', 'retentionDays', 'notifyOnAutoDelete', 'adminUserIds', 'allowAdminEdit', 'rejectionReasons', 'eventFunctions'];
out.rpUrlOff = (await api('o', 'PATCH', '/workflow/review-processes/' + RP, { ...Object.fromEntries(keep.filter(k => k in g).map(k => [k, g[k]])), webhookUrl: null })).s;
out.rpOn = (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: true })).s; offs.push(async () => (await api('o', 'PATCH', `/workflow/review-processes/${RP}/active`, { isActive: false, pendingAction: 'reject_all' })).s);
const w = await X.made('o', '/workflow/rules', X.wf(T.LEADS, 'QA RT 2706 On Edit marker', G, { trigger: 'RecordUpdated', actions: [X.fieldUpdate('description', 'QA RT 2706 WF ran')] }), 'workflow rule');
const wid = w.j?.data?.id; out.wf = w.s; await api('o', 'POST', `/workflow/rules/${wid}/activate`); offs.push(async () => (await api('o', 'POST', `/workflow/rules/${wid}/deactivate`)).s);
const bp = await api('o', 'POST', `/modules/${T.LEADS}/blueprints`, X.blueprint('leads', LAY2, null, 'rating', 'QA RT 2706 blueprint', X.bpCrit('first_name', G), ['acquired', 'active'], []));
const bid = bp.j?.data?.id; out.bp = bp.s + ' ' + (bid || bp.t.slice(0, 300));
if (bid) { ledger(`blueprint ${bid} "QA RT 2706 blueprint" (Leads, Standard Layout)`); const c = (await api('o', 'GET', `/modules/${T.LEADS}/blueprints/${bid}`)).j?.data; out.bpOn = (await api('o', 'PUT', `/modules/${T.LEADS}/blueprints/${bid}`, { isActive: true, definition: c.definition })).s;
  offs.push(async () => { const c2 = (await api('o', 'GET', `/modules/${T.LEADS}/blueprints/${bid}`)).j?.data; return (await api('o', 'PUT', `/modules/${T.LEADS}/blueprints/${bid}`, { isActive: false, definition: c2.definition })).s; }); }
const runsOf = async id => (await X.executions(id)).filter(e => e.ruleId === wid && /Updated/.test(e.triggerKind || '')).length;
const approveReview = async id => { for (let i = 0; i < 10; i++) { const c = (await X.reviewHistory('o', T.LEADS, id))?.cycles?.at(-1); if (c && /pending|in_review/.test(c.status)) return (await api('o', 'POST', `/workflow/reviews/${c.requestId}/fields/email/approve`, {})).s; await sleep(3000); } return 'not held'; };
out.runs = [];
try {
  for (let n = 1; n <= 4; n++) {
    const l = (await X.lead('o', `${G} run ${n}`, { email: `qa.rt.2706.${n}@example.com`, rating: 'acquired' }, LAY2)).j?.data?.id;
    const row = { lead: l, createReview: await approveReview(l) }; await sleep(12000);
    row.wfRunsBefore = await runsOf(l);
    const mu = await api('o', 'POST', `/modules/${T.LEADS}/records/mass-update`, { record_ids: [l], data: [{ field: 'email', value: { kind: 'string', value: `qa.rt.2706.${n}.mu@example.com` } }] });
    row.massUpdate = mu.s + (mu.s > 299 ? ' ' + mu.t.slice(0, 160) : '');
    await sleep(5000); row.heldAfterMU = (await X.reviewHistory('o', T.LEADS, l))?.cycles?.at(-1)?.status;
    row.approve = await approveReview(l); await sleep(20000);
    row.wfRunsAfter = await runsOf(l); row.wfRan = row.wfRunsAfter > row.wfRunsBefore;
    row.marker = await X.field('o', T.LEADS, l, 'description');
    row.blueprint = ((await X.bpState('o', T.LEADS, l))?.states || []).filter(s => s.blueprintName === 'QA RT 2706 blueprint').map(s => JSON.stringify(s.activeStates)).join('') || 'not in blueprint';
    out.runs.push(row);
  }
} finally { out.off = []; for (const f of offs.reverse()) out.off.push(await f()); }
return out;
