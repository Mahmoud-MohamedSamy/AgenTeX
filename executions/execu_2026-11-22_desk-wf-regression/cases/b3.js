// Batch 3 (run 2): skills actions AT-09..12 + IN-05 in QA AO Dept B; probes the skill body first.
const out = {}; const R = {}; const TK = {};
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' };
const q = '?department_id=' + DEPT2;
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions, o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '')).join(','));
// skill type
const st = await api('POST', '/desk/skill-types', { name: 'QA WF Type', department_id: DEPT2 }); const ST = st.j?.data?.id || st.j?.data?.skill_type?.id; out.type = st.s + ' ' + (ST || st.t.slice(0, 200)); if (ST) ledger(`skill type "QA WF Type" ${ST}`);
const probe = await api('POST', '/desk/skills' + q, {}); out.skillProbe = probe.s + ' ' + probe.t.slice(0, 600);
const mkSkill = async (name, prefix) => {
  const bodies = [
    { name, skill_type_id: ST, status: 'active', criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: prefix }], pattern: '1' } },
    { name, skill_type_id: ST, is_active: true, criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: prefix }], pattern: '1' } },
    { name, type_id: ST, status: 'active', criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: prefix }], pattern: '1' } }];
  for (const b of bodies) { const r = await api('POST', '/desk/skills' + q, b); const id = r.j?.data?.id || r.j?.data?.skill?.id; if (id) { ledger(`skill "${name}" ${id}`); return { id, body: Object.keys(b).join(',') }; } out['skill err ' + name] = (out['skill err ' + name] || '') + ' | ' + r.s + ' ' + r.t.slice(0, 250); }
  return {};
};
const s1 = await mkSkill('QA WF skill1', 'QA WF SK1'), s2 = await mkSkill('QA WF skill2', 'QA WF zz no'), s3 = await mkSkill('QA WF skill3', 'QA WF zz no3');
out.skills = { s1, s2, s3 };
if (!s1.id) { fs.writeFileSync(RUN + '/out/b3.json', JSON.stringify(out, null, 1)); return out; }
// agents: give DEV2 skill1 (for reassign) — agent skill save
const as = await api('PUT', `/desk/skills/${s1.id}/agents`, { user_ids: [DEV2] }); out.agentSkill = as.s + ' ' + as.t.slice(0, 160);
const sks = (await api('GET', '/desk/skills' + q)).j?.data; const list = sks?.skills || arr(sks); out.skillKeys = list.filter(x => /QA WF/.test(x.name)).map(x => ({ id: x.id, name: x.name, key: x.key || x.skill_key }));
const key = n => { const x = list.find(y => y.name === n); return x && (x.key || x.skill_key || x.name); };
// rules
await rule('AT09', CR, [{ type: 'AddTicketSkills', skillKeys: [key('QA WF skill2'), key('QA WF skill3')] }]);
await rule('AT09dup', CR, [{ type: 'AddTicketSkills', skillKeys: [key('QA WF skill1')] }], { noGuard: true, criteria: guard('QA WF SK1 dup') });
await rule('AT10', UP, [{ type: 'RemoveTicketSkills', skillKeys: [key('QA WF skill2'), 'qa-wf-gone-skill'] }]);
await rule('AT11', UP, [{ type: 'RecalculateTicketSkills' }]);
await rule('AT12', UP, [{ type: 'ReassignTicketBySkills' }], { noGuard: true, criteria: guard('QA WF SK1 reassign') });
await rule('AT12n', UP, [{ type: 'ReassignTicketBySkills' }]);
// CO-62..66 multi-select (Skills field)
await rule('CO62', UP, [FU({ qa_ndc_company_name: 'ANY' })], { noGuard: true, criteria: AND(guard('QA WF MS '), mem('skills', 'In', [key('QA WF skill2')])) });
await rule('CO63', UP, [FU({ qa_ndc_agency_code: 'NONE' })], { noGuard: true, criteria: AND(guard('QA WF MS '), NOT(mem('skills', 'In', [key('QA WF skill2')])) ) });
await rule('CO64', UP, [FU({ qa_ndc_ticket: 'EMPTY' })], { noGuard: true, criteria: AND(guard('QA WF MS '), ex('skills', 'IsNull')) });
await rule('CO65', UP, [FU({ qa_ndc_ticket: 'NOTEMPTY' })], { noGuard: true, criteria: AND(guard('QA WF MS '), ex('skills', 'IsNotNull')) });
await rule('CO66', UP, [FU({ qa_ndc_agent_name: 'CHANGED' })], { noGuard: true, criteria: AND(guard('QA WF MS '), changed('skills')) });
await sleep(2000);
// tickets
await tk('AT09', 'AT09');                       // gets skill2+skill3
await tk('AT09dup', 'SK1', {}, 'dup ticket');     // subject contains "QA WF SK1" → skill1 by criteria, rule adds skill1 again
await tk('AT10', 'AT10');
await tk('AT11', 'AT11', {}, 'QA WF SK1 later'); // criteria matches skill1 on create; recalc after subject change
await tk('AT12', 'SK1', {}, 'reassign ticket');  // skill1 → reassign to DEV2
await tk('AT12n', 'AT12n');                      // no skill → no one qualifies
await tk('MSa', 'MS', {}, 'a'); await tk('MSb', 'MS', {}, 'b');
await sleep(20000);
const sk0 = {}; for (const k of Object.keys(TK)) sk0[k] = (await getTicket(TK[k])).skills;
out.skillsAfterCreate = sk0;
// AT10: add skill2 by patch then edit triggers removal
await patchTicket(TK.AT10, { skills: [key('QA WF skill2')] }); await sleep(10000); out.at10before = (await getTicket(TK.AT10)).skills;
await patchTicket(TK.AT11, { subject: 'QA WF AT11 no match now' }); await sleep(3000);
await patchTicket(TK.AT12, { classification: 'problem' }); await patchTicket(TK.AT12n, { classification: 'problem' });
await patchTicket(TK.MSa, { skills: [key('QA WF skill2'), key('QA WF skill3')] }); await patchTicket(TK.MSb, { classification: 'problem' });
await sleep(30000);
const v = {};
for (const k of ['MSa', 'MSb']) { const g = await getTicket(TK[k]); v[k] = { skills: g.skills, any: g.qa_ndc_company_name, none: g.qa_ndc_agency_code, empty: g.qa_ndc_ticket, changed: g.qa_ndc_agent_name }; }
v.AT09 = { skills: (await getTicket(TK.AT09)).skills, run: await disp('AT09', 'AT09') };
v.AT09dup = { skills: (await getTicket(TK.AT09dup)).skills, run: await disp('AT09dup', 'AT09dup') };
v.AT10 = { skills: (await getTicket(TK.AT10)).skills, run: await disp('AT10', 'AT10') };
v.AT11 = { before: sk0.AT11, after: (await getTicket(TK.AT11)).skills, run: await disp('AT11', 'AT11') };
{ const g = await getTicket(TK.AT12); v.AT12 = { owner: g.owner, skills: g.skills, run: await disp('AT12', 'AT12') }; const n = await getTicket(TK.AT12n); v.AT12n = { owner: n.owner, run: await disp('AT12n', 'AT12n') }; }
out.v = v; out.R = R; out.TK = TK; out.ids = { ST, s1: s1.id, s2: s2.id, s3: s3.id };
fs.writeFileSync(RUN + '/out/b3.json', JSON.stringify(out, null, 1));
return out;
