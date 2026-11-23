// 23 Nov re-run of items not re-checked today: AT-12 (skills reassign), TR-06 (clean dept), L-09 API, + bulk inactive rules for PF-03/L-09 UI.
const out = {}; const R = {}; const TK = {};
const DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const nm = { [TU1]: 'Test User 1', [DEV2]: 'Dev Team 2', '97be04b6-0a08-4883-aa51-e1650b11cab7': 'owner' };
const mark = FU({ qa_ndc_agency_code: 'WF' }); const UP = { kind: 'RecordUpdated' };
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + (r.err || '').slice(0, 200); return r; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ' ' + e.triggerKind + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 110) + ')' : '')).join(','));
// --- AT-12 set-up: skill type + skill auto-applied on subject "QA WF SK2 ", given to Dev Team 2 only
const q = '?department_id=' + DEPT2;
const st = await api('POST', '/desk/skill-types', { name: 'QA WF Type RT6', department_id: DEPT2 }); const ST = st.j?.data?.id || st.j?.data?.skill_type?.id; if (ST) ledger(`skill type "QA WF Type RT6" ${ST}`); out.type = st.s;
const sk = await api('POST', '/desk/skills' + q, { name: 'QA WF skill RT6', type_id: ST, status: 'active', criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA WF SK2' }], pattern: '1' } });
const SK = sk.j?.data?.id || sk.j?.data?.skill?.id; if (SK) ledger(`skill "QA WF skill RT6" ${SK}`); out.skill = sk.s + (SK ? '' : ' ' + sk.t.slice(0, 200));
out.agentSkill = (await api('PUT', `/desk/skills/${SK}/agents`, { user_ids: [DEV2] })).s;
const us = arr((await api('GET', '/iam/users?take=200&app_key=desk')).j?.data); out.dev2 = (u => u && { status: u.status })(us.find(u => u.userId === DEV2));
await rule('RT6AT12', UP, [{ type: 'ReassignTicketBySkills' }], { noGuard: true, criteria: sm('subject', 'StartsWith', 'QA WF SK2 reassign'), departmentIds: [DEPT2] });
await rule('RT6AT12n', UP, [{ type: 'ReassignTicketBySkills' }], { departmentIds: [DEPT2] });
// --- TR-06 in QA RT19 WF Dept (no auto-tagging): On Edit, save same priority
await rule('RT6TR06', UP, [mark], { departmentIds: [DEPT] });
await sleep(3000);
TK.AT12 = (await mkTicket('SK2', { department: DEPT2 }, 'reassign ticket')).id;
TK.AT12n = (await mkTicket('RT6AT12n', { department: DEPT2 })).id;
TK.TR06 = (await mkTicket('RT6TR06', { department: DEPT, priority: 'high' })).id;
await sleep(25000);
out.AT12_before = { owner: nm[(await getTicket(TK.AT12)).owner] || (await getTicket(TK.AT12)).owner || 'none', skills: (await getTicket(TK.AT12)).skills };
// give the no-skill ticket an owner first, so we can see whether it gets cleared
out.assignN = (await api('POST', `/desk/tickets/${TK.AT12n}/assign`, { owner_id: TU1 })).s;
await sleep(5000);
out.TR06_runsBeforeEdit = (await execs(TK.TR06, R.RT6TR06)).map(e => e.triggerKind + ' ' + outcome(e));
await patchTicket(TK.TR06, { priority: 'high' });               // no-change save
await patchTicket(TK.AT12, { classification: 'problem' }); await patchTicket(TK.AT12n, { classification: 'problem' });
await sleep(25000);
out.TR06_runsAfterNoChangeSave = (await execs(TK.TR06, R.RT6TR06)).map(e => e.triggerKind + ' ' + outcome(e));
out.TR06_history = arr((await api('GET', `/desk/tickets/${TK.TR06}/history`)).j?.data).map(x => x.action + '/' + (x.actor_type || x.source || ''));
for (const k of ['AT12', 'AT12n']) { const g = await getTicket(TK[k]); out[k] = { owner: nm[g.owner] || g.owner || 'none', skills: g.skills, runs: await disp(k, 'RT6' + k) }; }
// --- L-09 API: list cap and reorder with a partial list (same order, so nothing moves)
const p1 = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=500`)).j?.data); out.L09_take500returns = p1.length; out.L09_total = (await allRules()).length;
fs.writeFileSync(RUN + '/out/rt6.json', JSON.stringify({ R, TK, out, SK, ST }, null, 1)); return out;
