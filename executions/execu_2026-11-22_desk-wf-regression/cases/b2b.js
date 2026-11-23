// Batch 2b: redo TR-09 (merge + exact counts), RM-04, RM-10, AC-09 team+agent, AC-10, AC-12, AC-25, TC-08 date; checks API-04, CF-11, L-10, OB-03.
const out = {}; const R = {}; const TK = {};
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const TEAM = 'fa641d99-ce7f-47ca-94e7-b15113bd4913', ND = '7122e4d4-8f6e-4d6e-8e0f-a96203e6c2cc';
const mark = FU({ qa_ndc_agency_code: 'WF' });
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' };
const DT = sec => ({ kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: sec, offsetMode: 'wall_clock' });
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; if (!t.id) out[k + ' tk'] = t.s + ' ' + t.err; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 140) + ')' : '')).join(','));
const at = s => new Date(Date.now() + s * 1000).toISOString();
const AR = async (body, name) => { const r = await api('POST', '/desk/assignment-rules', { description: 'QA', execute_on: ['create'], name, ...body }); const id = r.j?.data?.id || r.j?.data?.rule?.id; if (id) ledger(`assignment rule "${name}" ${id}`); out['ar ' + name] = r.s + (id ? '' : ' ' + r.t.slice(0, 200)); return id; };
// OB-03 recheck + L-10 limits endpoint
{ const any = (await api('GET', `/workflow/executions?recordId=d19b19bd-e48f-4a87-b560-546acac1525d&take=20`)).j?.data; out.OB03 = arr(any).length; }
out.L10 = (await api('GET', '/workflow/rules/limits?moduleId=' + T + '&departmentId=' + DEPT2)).t.slice(0, 500);
// API-04 comment + CF-11 values (batch 1 tickets)
out.API04 = (await api('GET', `/desk/tickets/d19b19bd-e48f-4a87-b560-546acac1525d/comments`)).t.slice(0, 700);
{ const b1 = JSON.parse(fs.readFileSync(RUN + '/out/b1.json', 'utf8')); const tid = (fs.readFileSync(RUN + '/ledger.md', 'utf8').match(/ticket "QA WF CF11a ticket" ([0-9a-f-]{36})/) || [])[1]; const g = await getTicket(tid); out.CF11 = { sla_name: g.sla_name, sla_violated: g.sla_violated, sla_escalated: g.sla_escalated, response_due: g.response_due }; out.API04exec = (await execs('d19b19bd-e48f-4a87-b560-546acac1525d', b1.R.API04)).map(e => outcome(e) + ' ' + JSON.stringify(e.dispatches).slice(0, 300)); }
// TR-09
const h = await hook();
await rule('TR09x', { kind: 'RecordDeleted' }, [WH(h, '{"ev":"delete","s":"${subject}"}')]);
await rule('TR09y', CR, [WH(h, '{"ev":"create","s":"${subject}"}')], { noGuard: true, criteria: guard('QA WF TR09x ') });
// RM-04, RM-10, TC-08 date
await rule('RM04x', UP, [mark], { mode: 'OneTime' });
await rule('RM10x', CR, [mark], { departmentIds: [DEPT2, ND] });
await rule('TC08dx', DT(-60), [mark], { criteria: cmp('executionTime', 'Equal', S('business_hours')) });
// AC-09 team + agent; AC-10 assignment rules; AC-12 outsider; AC-25 no contact
await rule('AC09ax', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'TeamWithAgent', ownerValue: TEAM, ownerAgentId: TU1 }]);
const A1 = await AR({ type: 'direct', name: 'QA WF AR direct2', is_active: true, targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF AC10' }], pattern: '1' }, coming_to_department_id: DEPT2, move_to_department_id: null, assign: { kind: 'agent', user_id: TU1, team_id: null } }] }, 'QA WF AR direct2');
const A2 = await AR({ type: 'round_robin', department_id: DEPT2, name: 'QA WF AR rr2', is_active: true, targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF AC10' }], pattern: '1' }, method: 'sequential', pool: { kind: 'agents', user_ids: [TU1, OWN], team_id: null, excluded_user_ids: [] } }] }, 'QA WF AR rr2');
const A3 = await AR({ type: 'direct', name: 'QA WF AR deleted', is_active: true, targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF AC10' }], pattern: '1' }, coming_to_department_id: DEPT2, move_to_department_id: null, assign: { kind: 'agent', user_id: TU1, team_id: null } }] }, 'QA WF AR deleted');
if (A1) await rule('AC10d', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: A1 }]);
if (A2) await rule('AC10r2', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: A2 }]);
if (A3) { await rule('AC10x', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'AssignmentRule', ownerValue: A3 }]); const d = await api('DELETE', '/desk/assignment-rules/' + A3); out.ac10del = d.s; const g = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.AC10x); out.ac10xAfterDelete = g && { active: g.isActive, action: JSON.stringify(g.actions[0]).slice(0, 200) }; }
const users = arr((await api('GET', '/iam/users?take=200')).j?.data); const uid = u => u.id || u.userId || u.user_id;
const outsider = users.find(u => /active/i.test(u.status || '') && ![TU1, DEV2, OWN].includes(uid(u)) && uid(u)); out.outsider = outsider && { name: outsider.displayName, id: uid(outsider), keys: Object.keys(outsider).slice(0, 12) };
if (outsider) await rule('AC12x', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: uid(outsider) }]);
await rule('AC25x', CR, [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: S('QA WF x') } }]);
await sleep(2000);
// tickets
await tk('TRd', 'TR09x', {}, 'del'); await tk('TRr', 'TR09x', {}, 'restore'); await tk('TRs', 'TR09x', {}, 'spam'); await tk('TRm1', 'TR09x', {}, 'master'); await tk('TRm2', 'TR09x', {}, 'child');
await tk('RM04x', 'RM04x'); await tk('RM10a', 'RM10x', {}, 'a');
await tk('TC08dx', 'TC08dx', { due_date: at(110) });
await tk('AC09ax', 'AC09ax'); await tk('AC10d', 'AC10d'); await tk('AC10r2', 'AC10r2'); await tk('AC10x', 'AC10x');
if (outsider) await tk('AC12x', 'AC12x'); await tk('AC25x', 'AC25x', { email: undefined });
await sleep(12000);
// TR-09 events
await delTicket(TK.TRd); await delTicket(TK.TRr); await sleep(8000);
const bin = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).find(i => i.record_id === TK.TRr); out.restore = bin ? (await api('POST', '/audit/recycle-bin/restore', { ids: [bin.id] })).s : 'not in bin';
out.spam = (await api('POST', '/desk/tickets/bulk/spam', { ticket_ids: [TK.TRs] })).s;
const mg = await api('POST', '/desk/tickets/merge', { master_ticket_id: TK.TRm1, ticket_ids: [TK.TRm1, TK.TRm2] }); out.merge = mg.s + ' ' + mg.t.slice(0, 250);
// RM-04: fire once, edit rule (PUT), edit ticket; deactivate/activate, edit ticket
await patchTicket(TK.RM04x, { classification: 'problem' }); await sleep(8000);
{ const g = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.RM04x); const pu = await api('PUT', '/workflow/rules/' + R.RM04x, { moduleId: T, name: g.name, description: 'edited', isActive: true, mode: g.mode, trigger: g.trigger, criteria: g.criteria, actions: g.actions, departmentIds: g.departmentIds, version: g.version }); out.rm04put = pu.s + (pu.s >= 300 ? ' ' + pu.t.slice(0, 200) : ''); }
await patchTicket(TK.RM04x, { classification: 'question' }); await sleep(8000); out.rm04afterEdit = await fired(TK.RM04x, R.RM04x);
out.rm04toggle = (await api('POST', `/workflow/rules/${R.RM04x}/deactivate`, {})).s + '/' + (await api('POST', `/workflow/rules/${R.RM04x}/activate`, {})).s;
await patchTicket(TK.RM04x, { classification: 'problem' }); await sleep(8000); out.rm04afterToggle = await fired(TK.RM04x, R.RM04x);
// RM-10: deactivate dept (full body), ticket, then remove agents + delete dept, ticket
const dep = (await api('GET', '/desk/departments/' + ND)).j?.data;
const de = await api('PATCH', '/desk/departments/' + ND, { name: dep.name, is_active: false }); out.rm10deact = de.s + ' ' + (de.s >= 300 ? de.t.slice(0, 200) : '');
out.rm10ruleAfterInactive = (arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.RM10x) || {}).departmentIds;
await tk('RM10b', 'RM10x', {}, 'b');
const ra = await api('PATCH', '/desk/departments/' + ND, { name: dep.name, agent_user_ids: [] }); out.rm10noAgents = ra.s + ' ' + (ra.s >= 300 ? ra.t.slice(0, 200) : '');
let dd = await api('DELETE', '/desk/departments/' + ND); if (dd.s >= 300) dd = await api('DELETE', '/desk/departments/' + ND + '?transfer_to=' + DEPT2); out.rm10delete = dd.s + ' ' + dd.t.slice(0, 200); if (dd.s < 300) ledger('department QA WF RM10 Dept deleted');
const g10 = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.RM10x); out.rm10ruleAfterDelete = g10 && { active: g10.isActive, depts: g10.departmentIds };
await tk('RM10c', 'RM10x', {}, 'c');
await sleep(150000);
const v = {};
v.TR09 = { hooks: (await hookReqs(h)).map(x => x.content), restore: out.restore, spam: out.spam, merge: out.merge, child: (await getTicket(TK.TRm2))._s };
v.RM04 = { put: out.rm04put, afterEdit: out.rm04afterEdit, toggle: out.rm04toggle, afterToggle: out.rm04afterToggle };
v.RM10 = { a: await fired(TK.RM10a, R.RM10x), b: await fired(TK.RM10b, R.RM10x), c: await fired(TK.RM10c, R.RM10x), deact: out.rm10deact, inactiveDepts: out.rm10ruleAfterInactive, noAgents: out.rm10noAgents, del: out.rm10delete, afterDelete: out.rm10ruleAfterDelete };
v.TC08date = await fired(TK.TC08dx, R.TC08dx);
for (const k of ['AC09ax', 'AC10d', 'AC10r2', 'AC10x', 'AC12x', 'AC25x']) if (TK[k]) { const g = await getTicket(TK[k]); v[k] = { owner: g.owner, team: g.team, contact: g.contact_id, run: await disp(k, k) }; }
out.v = v; out.R = R; out.TK = TK; out.ars = { A1, A2, A3 };
fs.writeFileSync(RUN + '/out/b2b.json', JSON.stringify(out, null, 1));
return out;
