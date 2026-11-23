// Re-verify findings still reproduce today (23 Nov) before the review report. Tag prefix RV. Dept B, guarded rules.
const out = {}; const R = {}; const TK = {};
for (const r of (await allRules()).filter(r => /^QA WF RV/.test(r.name))) await api('DELETE', '/workflow/rules/' + r.id);
const mark = FU({ qa_ndc_agency_code: 'WF' });
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' };
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], { departmentIds: [DEPT2], ...o }); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + (r.err || '').slice(0, 200); return r; };
const tk = async (k, tag, vals, suf) => { TK[k] = (await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf)).id; return TK[k]; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 110) + ')' : '')).join(','));
const at = s => new Date(Date.now() + s * 1000).toISOString();
// saves only (API validation findings)
const sv = async (k, trig, actions, crit, active) => { const r = await rule(k, trig, actions, { criteria: crit, active: !!active }); return r.s + (r.id ? ' SAVED' : ' ' + (r.err || '').slice(0, 160)); };
out.MX04 = await sv('RVMX04', { kind: 'RecordDeleted' }, [{ type: 'SendHappinessEmail' }]);
out.CO90 = await sv('RVCO90', CR, [mark], { kind: 'Between', field: 'due_date', low: TS(at(10 * 86400)), high: TS(at(86400)) });
out.CO90alt = await sv('RVCO90b', CR, [mark], AND(cmp('due_date', 'GreaterThanOrEqual', TS(at(10 * 86400))), cmp('due_date', 'LessThanOrEqual', TS(at(86400)))));
// API-01: inactive rule, PATCH with only actions
{ await rule('RVAPI01', CR, [mark], { criteria: sm('subject', 'StartsWith', 'QA WF RVAPI01 '), noGuard: true, active: false }); const p = await api('PATCH', '/workflow/rules/' + R.RVAPI01, { actions: [{ order: 0, delaySeconds: 0, ...FU({ qa_ndc_agency_code: 'X' }) }] }); const g = (await allRules()).find(x => x.id === R.RVAPI01); out.API01 = p.s + ' criteria after: ' + JSON.stringify(g && g.criteria).slice(0, 80) + ' active ' + (g && g.isActive); }
// CO-92: tag deleted while used
{ const tg = await api('POST', '/desk/tags', { name: 'zz wf rv92', department_id: DEPT2 }); const tid = tg.j?.data?.id; if (tid) ledger(`tag "zz wf rv92" ${tid}`); await rule('RVCO92', CR, [mark], { criteria: mem('tags', 'In', [tid]) }); const d = await api('DELETE', '/desk/tags/' + tid + '?confirm=true'); const g = (await allRules()).find(x => x.id === R.RVCO92); out.CO92 = 'tag delete ' + d.s + '; rule active ' + (g && g.isActive) + '; save ' + (out["RVCO92 save"] || 'ok') + '; tag id ' + tid + '; criteria ' + String(JSON.stringify(g && g.criteria)).slice(0, 160); }
// runtime ones
await rule('RVCO86cs', CR, [mark], { criteria: sm('subject', 'Contains', 'co86 lower', false) });
await rule('RVCO86eq', CR, [mark], { criteria: cmp('qa_ndc_ticket', 'Equal', S('abc')) });
await rule('RVCF11', CR, [mark], { criteria: cmp('sla_violated', 'Equal', B(false)) });
await rule('RVAC25', CR, [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: S('QA WF x') } }]);
await rule('RVAT03', CR, [{ type: 'AddTicketComment', commentBody: 'S=${subject} P=${priority} N=${ticket_number} END', commentPublic: false }]);
await rule('RVAC03', CR, [FU({ classification: 'Problem' })]);
await rule('RVTR06', UP, [mark]);
await rule('RVMR07', CR, [{ ...FU({ qa_ndc_company_name: 'MR07-v1' }), delaySeconds: 60 }]);
await rule('RVTD11', { kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: 60, offsetMode: 'wall_clock' }, [mark]);
await sleep(3000);
await tk('CO86', 'RVCO86cs', {}, 'CO86 LOWER'); await tk('CO86eq', 'RVCO86eq', { qa_ndc_ticket: 'ABC' }); await tk('CF11', 'RVCF11'); await tk('AC25', 'RVAC25', { email: undefined }); await tk('AT03', 'RVAT03'); await tk('AC03', 'RVAC03');
await tk('TR06', 'RVTR06', { priority: 'high' }); await tk('MR07', 'RVMR07'); await tk('TD11', 'RVTD11', { due_date: at(-1800) });
await sleep(20000);
const tr0 = (await execs(TK.TR06, R.RVTR06)).length; await patchTicket(TK.TR06, { priority: 'high' }); 
// MR-07: edit rule while pending (full body PATCH)
{ const g = (await allRules()).find(x => x.id === R.RVMR07); const body = { moduleId: T, name: g.name, description: g.description, isActive: g.isActive, mode: g.mode, trigger: g.trigger, criteria: g.criteria, actions: [{ order: 0, delaySeconds: 60, ...FU({ qa_ndc_company_name: 'MR07-v2' }) }], departmentIds: g.departmentIds, version: g.version }; out.MR07patch = (await api('PATCH', '/workflow/rules/' + R.RVMR07, body)).s; }
await sleep(120000);
const g = async k => getTicket(TK[k]);
out.v = {
  CO86_containsCaseSensitive: await disp('CO86', 'RVCO86cs'), CO86_equalsABCvsabc: await disp('CO86eq', 'RVCO86eq'),
  CF11_slaViolatedFalse: { val: (await g('CF11')).sla_violated ?? null, runs: await disp('CF11', 'RVCF11') },
  AC25_noContact: { contact: (await g('AC25')).contact_id ?? null, runs: await disp('AC25', 'RVAC25') },
  AT03: { runs: await disp('AT03', 'RVAT03'), comment: ((await api('GET', `/desk/tickets/${TK.AT03}/comments`)).t.match(/S=[^<"]{0,80}END/) || [''])[0], ticketNumber: (await g('AT03')).ticket_number },
  AC03: { stored: (await g('AC03')).classification, runs: await disp('AC03', 'RVAC03') },
  TR06_samePriority: { before: tr0, after: (await execs(TK.TR06, R.RVTR06)).length },
  MR07: { value: (await g('MR07')).qa_ndc_company_name ?? null, runs: await disp('MR07', 'RVMR07') },
  TD11_pastDue: await disp('TD11', 'RVTD11'),
};
fs.writeFileSync(RUN + '/out/rv1.json', JSON.stringify({ R, TK, out }, null, 1)); return out;
