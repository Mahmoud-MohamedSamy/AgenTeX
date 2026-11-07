const o = {}; const A = X.ids.DEPT_A; const S1 = '7d262fb2-0b98-488e-b76b-d9a604648f93', S2 = '921d2517-0d33-459d-97f2-2f760a7c7d3d', S3 = '21e9c438-87ed-49cd-a526-0a0db8f25d1a';
const N = { '3445ec4a-020e-4f12-b156-dd2de7610164': 'A1', 'd23fb4e0-248d-41f6-af60-d28885a7007e': 'A2', '97be04b6-0a08-4883-aa51-e1650b11cab7': 'O', '9d182dfa-05f3-4af7-9685-8615a2fbe537': 'A3' };
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''} ${r.j?.error?.details ? JSON.stringify(r.j.error.details).slice(0, 200) : ''}`.trim();
o.prefs = full(await api('o', 'PUT', `desk:/desk/skill-preferences?department_id=${A}`, { auto_add: true, placement: 'field' }));
const skillsOf = async id => { const f = await X.fields(id); return f.skills; };
// item 2 + list order
const t1 = (await X.ticket('QA RT12 2752 sk1 ticket')).j?.data?.id; await sleep(8000); o.t1skills = await skillsOf(t1);
// item 6 reorder: sk3 before sk1
const L = arr((await api('o', 'GET', `desk:/desk/skills?department_id=${A}`)).j?.data?.skills); const ids = L.map(s => s.id); const i1 = ids.indexOf(S1), i3 = ids.indexOf(S3); [ids[i1], ids[i3]] = [ids[i3], ids[i1]];
o.reorder = full(await api('o', 'PUT', `desk:/desk/skills/order?department_id=${A}`, { skill_ids: ids }));
o.orderNow = arr((await api('o', 'GET', `desk:/desk/skills?department_id=${A}`)).j?.data?.skills).filter(s => /qa_rt12/.test(s.name)).map(s => s.sort_order + ':' + s.name);
const t2 = (await X.ticket('QA RT12 2752 sk1 ticket2')).j?.data?.id; await sleep(8000); o.t2skills = await skillsOf(t2);
// item 7: recalc / assign by skills on one ticket
o.patchSubj = full(await api('o', 'PATCH', `desk:/modules/${X.TK}/records/${t2}`, { data: [{ field: 'subject', value: { kind: 'string', value: 'QA RT12 2752 recalc (no sk-one)' } }] }));
await sleep(3000); o.t2beforeRecalc = await skillsOf(t2);
o.recalc = full(await api('o', 'POST', `desk:/desk/tickets/${t2}/skills/recalculate`, {})); await sleep(3000); o.t2afterRecalc = await skillsOf(t2);
o.unassign = full(await api('o', 'POST', `desk:/desk/tickets/${t1}/assign`, { owner_id: null, team_id: null }));
const as = await api('o', 'POST', `desk:/desk/tickets/${t1}/skills/assign`, {}); o.assignBySkills = full(as) + ' ' + as.t.slice(0, 200); await sleep(3000); const f1 = await X.fields(t1); o.t1owner = N[f1.owner] || f1.owner;
// item 8: where used
const wf = await api('o', 'POST', 'desk:/workflow/rules', { moduleId: X.TK, layoutId: '', name: 'QA RT12 2752 add skill', description: 'QA retest r12 - safe to delete', mode: 'Recurring', isActive: false, trigger: { kind: 'RecordCreated' }, criteria: { kind: 'StringMatch', field: 'subject', operator: 'Contains', stringValue: 'QA RT12 2752 wf', caseInsensitive: false }, actions: [{ type: 'AddSkills', order: 0, delaySeconds: 0, skills: ['qa_rt12_2752_sk1'] }] });
o.wf = full(wf); if (wf.j?.data?.id) ledger('NDC-2752: workflow rule "QA RT12 2752 add skill" ' + wf.j.data.id);
o.usage = (await api('o', 'GET', `desk:/desk/skills/${S1}/usage`)).t.slice(0, 500);
o.ids = { t1, t2 };
return o;
