const o = {}; const A = X.ids.DEPT_A; const S3 = '21e9c438-87ed-49cd-a526-0a0db8f25d1a'; const T = arr((await api('o', 'GET', 'desk:/desk/skill-types')).j?.data?.types).find(t => t.name === 'QA RT12 2752 type').id;
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''} ${r.j?.error?.details ? JSON.stringify(r.j.error.details).slice(0, 200) : ''}`.trim();
const skillsOf = async id => { const r = await api('o', 'GET', `desk:/modules/${X.TK}/records/${id}`); const f = arr(r.j?.data?.data).find(x => x.field === 'skills'); return (f?.value?.items || []).map(i => i.value).join(','); };
const tk = async s => { const r = await X.ticket('QA RT12 2752 ' + s); await sleep(8000); return r.j?.data?.id; };
const c1 = await api('o', 'POST', `desk:/desk/skills?department_id=${A}`, { name: 'qa_rt12_2752_sk1', type_id: T, description: 'QA retest r12 - safe to delete', is_active: true, criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA RT12 2752 sk1' }], pattern: null }, agent_ids: ['3445ec4a-020e-4f12-b156-dd2de7610164'] });
const S1 = c1.j?.data?.id; o.recreate = full(c1); if (S1) ledger('NDC-2752: skill "qa_rt12_2752_sk1" (recreated) ' + S1);
const order = async () => arr((await api('o', 'GET', `desk:/desk/skills?department_id=${A}`)).j?.data?.skills).filter(s => /qa_rt12/.test(s.name)).map(s => s.sort_order + ':' + s.name).join(' ');
o.orderA = await order(); o.t5 = await skillsOf(await tk('sk1 ticket5'));
const L = arr((await api('o', 'GET', `desk:/desk/skills?department_id=${A}`)).j?.data?.skills); const ids = L.map(s => s.id); const i1 = ids.indexOf(S1), i3 = ids.indexOf(S3); [ids[i1], ids[i3]] = [ids[i3], ids[i1]];
o.reorder = full(await api('o', 'PUT', `desk:/desk/skills/order?department_id=${A}`, { skill_ids: ids })); o.orderB = await order(); o.t6 = await skillsOf(await tk('sk1 ticket6'));
// workflow where-used and 10 limit
const wf = (name, keys) => api('o', 'POST', 'desk:/workflow/rules', { moduleId: X.TK, layoutId: '', name, description: 'QA retest r12 - safe to delete', mode: 'Recurring', isActive: false, trigger: { kind: 'RecordCreated' }, criteria: { kind: 'StringMatch', field: 'subject', operator: 'Contains', stringValue: 'QA RT12 2752 wf', caseInsensitive: false }, actions: [{ type: 'AddTicketSkills', order: 0, delaySeconds: 0, skillKeys: keys }] });
const w1 = await wf('QA RT12 2752 add skill', ['qa_rt12_2752_sk1']); o.wf = full(w1); if (w1.j?.data?.id) ledger('NDC-2752: workflow rule "QA RT12 2752 add skill" ' + w1.j.data.id);
o.usage = JSON.stringify((await api('o', 'GET', `desk:/desk/skills/${S1}/usage`)).j?.data?.workflow);
const eleven = ['tier_1_support', 'tier_2_support', 'escalation_handling', 'billing', 'account_management', 'product_expertise', 'qa_rt12_2752_sk1', 'qa_rt12_2752_sk3', 'qa_rt12_2752_sk2_inactive', 'x10', 'x11'];
const w2 = await wf('QA RT12 2752 eleven', eleven); o.wf11 = full(w2); if (w2.j?.data?.id) ledger('NDC-2752: workflow rule eleven (should not exist) ' + w2.j.data.id);
// ticket with 11 skills set directly
const r11 = await api('o', 'POST', `desk:/modules/${X.TK}/records`, { data: [{ field: 'subject', value: { kind: 'string', value: 'QA RT12 2752 eleven skills' } }, { field: 'department', value: { kind: 'string', value: A } }, { field: 'status', value: { kind: 'string', value: 'Open' } }, { field: 'skills', value: { kind: 'array', items: eleven.slice(0, 9).concat(['tier_1_support', 'billing']).map(v => ({ kind: 'string', value: v })) } }] });
o.t11create = full(r11); if (r11.j?.data?.id) { ledger('ticket "QA RT12 2752 eleven skills" ' + r11.j.data.id); await sleep(3000); o.t11skills = (await skillsOf(r11.j.data.id)).split(',').length; }
o.S1 = S1; return o;
