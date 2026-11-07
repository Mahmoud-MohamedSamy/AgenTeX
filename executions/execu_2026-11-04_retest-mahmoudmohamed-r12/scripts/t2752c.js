const o = {}; const A = X.ids.DEPT_A; const S1 = '7d262fb2-0b98-488e-b76b-d9a604648f93', S3 = '21e9c438-87ed-49cd-a526-0a0db8f25d1a';
const N = { '3445ec4a-020e-4f12-b156-dd2de7610164': 'A1', 'd23fb4e0-248d-41f6-af60-d28885a7007e': 'A2', '97be04b6-0a08-4883-aa51-e1650b11cab7': 'O', '9d182dfa-05f3-4af7-9685-8615a2fbe537': 'A3' };
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''} ${r.j?.error?.details ? JSON.stringify(r.j.error.details).slice(0, 200) : ''}`.trim();
const skillsOf = async id => (await X.fields(id)).skills;
const tk = async s => { const r = await X.ticket('QA RT12 2752 ' + s); await sleep(8000); return r.j?.data?.id; };
// order now: sk3 before sk1 (reordered in t2752b)
const t3 = await tk('sk1 ticket3'); o.t3_sk3First = await skillsOf(t3);
const L = arr((await api('o', 'GET', `desk:/desk/skills?department_id=${A}`)).j?.data?.skills); const ids = L.map(s => s.id); const i1 = ids.indexOf(S1), i3 = ids.indexOf(S3); [ids[i1], ids[i3]] = [ids[i3], ids[i1]];
o.reorderBack = full(await api('o', 'PUT', `desk:/desk/skills/order?department_id=${A}`, { skill_ids: ids }));
const t4 = await tk('sk1 ticket4'); o.t4_sk1First = await skillsOf(t4);
// recalculate one ticket
await api('o', 'PATCH', `desk:/modules/${X.TK}/records/${t3}`, { data: [{ field: 'subject', value: { kind: 'string', value: 'QA RT12 2752 recalc no-one' } }] }); await sleep(3000);
o.t3_beforeRecalc = await skillsOf(t3); o.recalc = full(await api('o', 'POST', `desk:/desk/tickets/${t3}/skills/recalculate`, {})); await sleep(3000); o.t3_afterRecalc = await skillsOf(t3);
// assign by skills: t4 has sk1+sk3; A1 holds both, A2 only sk3
o.unassign = full(await api('o', 'POST', `desk:/desk/tickets/${t4}/assign`, { owner_id: null, team_id: null }));
const as = await api('o', 'POST', `desk:/desk/tickets/${t4}/skills/assign`, {}); o.assignBySkills = as.s + ' ' + JSON.stringify(as.j?.data); await sleep(2000); o.t4owner = N[(await X.fields(t4)).owner];
// where used + workflow action limit
const wf = (name, skills, active = false) => api('o', 'POST', 'desk:/workflow/rules', { moduleId: X.TK, layoutId: '', name, description: 'QA retest r12 - safe to delete', mode: 'Recurring', isActive: active, trigger: { kind: 'RecordCreated' }, criteria: { kind: 'StringMatch', field: 'subject', operator: 'Contains', stringValue: 'QA RT12 2752 wf', caseInsensitive: false }, actions: [{ type: 'AddTicketSkills', order: 0, delaySeconds: 0, skills }] });
const w1 = await wf('QA RT12 2752 add skill', ['qa_rt12_2752_sk1']); o.wf = full(w1); if (w1.j?.data?.id) ledger('NDC-2752: workflow rule "QA RT12 2752 add skill" ' + w1.j.data.id);
if (w1.s >= 400) o.wfBody = w1.t.slice(0, 300);
o.usage = JSON.stringify((await api('o', 'GET', `desk:/desk/skills/${S1}/usage`)).j?.data?.workflow);
const eleven = Array.from({ length: 11 }, (_, i) => 'qa_rt12_2752_sk' + (i + 1)); const w2 = await wf('QA RT12 2752 eleven', eleven); o.wf11 = full(w2); if (w2.j?.data?.id) ledger('NDC-2752: workflow rule eleven (should not exist) ' + w2.j.data.id);
// delete warning: try deleting sk1 while used
const del = await api('o', 'DELETE', `desk:/desk/skills/${S1}`); o.deleteUsed = full(del) + ' ' + del.t.slice(0, 250);
o.ids = { t3, t4 };
return o;
