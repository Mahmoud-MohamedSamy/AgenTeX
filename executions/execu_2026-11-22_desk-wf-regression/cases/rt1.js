// Retest of the 5 FAIL cases (23 Nov): AC-07, AC-10, TC-01, TC-04, OB-02. Tag prefix RT.
const out = {}; const R = {}; const TK = {};
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7', ORG = '7972984b-b5cc-034a-bd96-6de61e3937d0';
const nm = { [TU1]: 'Test User 1', [DEV2]: 'Dev Team 2', [OWN]: 'owner' };
const mark = FU({ qa_ndc_agency_code: 'WF' });
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' };
const DT = sec => ({ kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: sec, offsetMode: 'wall_clock' });
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; if (!t.id) out[k + ' tk'] = t.s + ' ' + t.err; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '')).join(','));
const at = s => new Date(Date.now() + s * 1000).toISOString();
const AR = async (body, name) => { const r = await api('POST', '/desk/assignment-rules', { description: 'QA', execute_on: ['create'], name, ...body }); const id = r.j?.data?.id || r.j?.data?.rule?.id; if (id) ledger(`assignment rule "${name}" ${id}`); out['ar ' + name] = r.s + (id ? '' : ' ' + r.t.slice(0, 200)); return id; };
// pre-checks
out.roleMembers = arr((await api('GET', '/iam/users?take=200')).j?.data).filter(u => u.orgUnitId === ORG).map(u => (u.displayName || u.email || '').slice(0, 30) + ' ' + u.status);
// OB-02
{ const draft = { moduleId: T, name: 'QA WF RTOB draft', mode: 'Recurring', trigger: CR, criteria: cmp('priority', 'Equal', S('high')), actions: [{ order: 0, delaySeconds: 0, ...FU({ qa_ndc_company_name: 'T' }) }], departmentIds: [DEPT2] };
  const e1 = await api('POST', '/workflow/rules/evaluate', { rule: draft, sampleRecord: { recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { priority: S('high') } } });
  const e2 = await api('POST', '/workflow/rules/evaluate', { rule: draft, sampleRecord: { recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { priority: S('low') } } });
  out.OB02 = { match: e1.s + ' ' + e1.t.slice(0, 300), noMatch: e2.s + ' ' + e2.t.slice(0, 200) }; }
// rules
await rule('RTAC07', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'OrgUnitRoundRobin', ownerValue: ORG }]);
await rule('RTTC01', CR, [mark], { criteria: changed('priority') });
await rule('RTTC04', DT(-120), [mark], { criteria: cmp('priority', 'Equal', S('high')) });
const A1 = await AR({ type: 'direct', name: 'QA WF RT direct', is_active: true, targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF RTAC10d' }], pattern: '1' }, coming_to_department_id: DEPT2, move_to_department_id: null, assign: { kind: 'agent', user_id: TU1, team_id: null } }] }, 'QA WF RT direct');
const A2 = await AR({ type: 'round_robin', department_id: DEPT2, name: 'QA WF RT rr', is_active: true, targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF RTAC10r' }], pattern: '1' }, method: 'sequential', pool: { kind: 'agents', user_ids: [TU1, OWN], team_id: null, excluded_user_ids: [] } }] }, 'QA WF RT rr');
if (A1) await rule('RTAC10d', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: A1 }]);
if (A2) await rule('RTAC10r', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: A2 }]);
await sleep(3000);
// tickets
for (let i = 0; i < 3; i++) { await tk('AC07' + i, 'RTAC07', {}, 'n' + i); await sleep(2000); }
await tk('TC01', 'RTTC01', { priority: 'high' });
await tk('TC04a', 'RTTC04', { priority: 'high', due_date: at(200) }, 'a'); await tk('TC04b', 'RTTC04', { priority: 'high', due_date: at(200) }, 'b'); await tk('TC04c', 'RTTC04', { priority: 'low', due_date: at(200) }, 'c');
if (A1) await tk('AC10d', 'RTAC10d'); if (A2) await tk('AC10r', 'RTAC10r');
await sleep(15000);
await patchTicket(TK.TC04b, { priority: 'low' }); await patchTicket(TK.TC04c, { priority: 'high' });
await sleep(30000);
const v = {};
v.AC07 = []; for (let i = 0; i < 3; i++) { const o = (await getTicket(TK['AC07' + i])).owner; v.AC07.push((nm[o] || o || 'none') + ' | ' + (await disp('AC07' + i, 'RTAC07')).join(' ')); }
v.TC01 = await disp('TC01', 'RTTC01');
for (const k of ['AC10d', 'AC10r']) if (TK[k]) { const g = await getTicket(TK[k]); v[k] = { owner: nm[g.owner] || g.owner || 'none', run: await disp(k, 'RT' + k) }; }
await sleep(230000); // TC-04 fire ~80 s after create + margin
v.TC04 = {}; for (const k of ['TC04a', 'TC04b', 'TC04c']) v.TC04[k] = { prio: (await getTicket(TK[k])).priority, mark: (await getTicket(TK[k])).qa_ndc_agency_code || '-', run: await disp(k, 'RTTC04') };
out.v = v; out.R = R; out.TK = TK; out.AR = { A1, A2 };
fs.writeFileSync(RUN + '/out/rt1.json', JSON.stringify(out, null, 1));
return out;
