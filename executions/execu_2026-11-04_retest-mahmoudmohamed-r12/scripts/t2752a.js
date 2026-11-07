const o = {}; const A = X.ids.DEPT_A; const U = { A1: '3445ec4a-020e-4f12-b156-dd2de7610164', A2: 'd23fb4e0-248d-41f6-af60-d28885a7007e' };
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''} ${r.j?.error?.details ? JSON.stringify(r.j.error.details).slice(0, 200) : ''}`.trim();
const C = v => ({ conditions: [{ field_key: 'subject', operator: 'contains', value: v }], pattern: null });
// item 3: type required
o.noType = full(await api('o', 'POST', `desk:/desk/skills?department_id=${A}`, { name: 'qa_rt12_2752_notype', description: null, is_active: true, criteria: C('zzz'), agent_ids: [] }));
const ty = await api('o', 'POST', 'desk:/desk/skill-types', { name: 'QA RT12 2752 type' }); o.type = full(ty); const T = ty.j?.data?.id || ty.j?.data?.type?.id; if (T) ledger('NDC-2752: skill type "QA RT12 2752 type" ' + T);
const mk = async (name, active, crit, agents) => { const r = await api('o', 'POST', `desk:/desk/skills?department_id=${A}`, { name, type_id: T, description: 'QA retest r12 - safe to delete', is_active: active, criteria: crit, agent_ids: agents }); const id = r.j?.data?.id || r.j?.data?.skill?.id; if (id) ledger(`NDC-2752: skill "${name}" ${id} (Dept A)`); return { r: full(r), id }; };
const s1 = await mk('qa_rt12_2752_sk1', true, C('QA RT12 2752 sk1'), [U.A1]);
const s2 = await mk('qa_rt12_2752_sk2_inactive', false, C('QA RT12 2752'), [U.A1]);
const s3 = await mk('qa_rt12_2752_sk3', true, C('QA RT12 2752'), [U.A1, U.A2]);
o.created = { s1: s1.r, s2: s2.r, s3: s3.r }; o.ids = { s1: s1.id, s2: s2.id, s3: s3.id };
const list = arr((await api('o', 'GET', `desk:/desk/skills?department_id=${A}`)).j?.data?.skills); o.list = list.map(s => `${s.sort_order}:${s.name}:${s.is_active ? 'A' : 'I'}:agents=${s.agent_count}`);
o.otherDeptHasSk1 = arr((await api('o', 'GET', `desk:/desk/skills?department_id=${X.ids.DEPT_B}`)).j?.data?.skills).some(s => /qa_rt12_2752/.test(s.name));
// preferences: auto add, list order
const prefsOld = (await api('o', 'GET', `desk:/desk/skill-preferences?department_id=${A}`)).j?.data; o.prefsOld = prefsOld;
for (const pl of ['order', 'list', 'settings', 'list_order']) { const p = await api('o', 'PUT', `desk:/desk/skill-preferences?department_id=${A}`, { auto_add: true, placement: pl }); o['prefs_' + pl] = full(p); if (p.s < 300) { o.placement = pl; break; } }
ledger('NDC-2752: Dept A skill preferences ' + JSON.stringify(prefsOld) + ' -> auto_add true, placement ' + o.placement + ' (restore at cleanup)');
return o;
