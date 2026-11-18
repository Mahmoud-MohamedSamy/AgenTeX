const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
const ACC = '784400e1-4a2a-42c2-b4f3-7ca56e79828a', CON = '0924eb24-e42a-4eab-8efd-e3428f19e882', D = '6edaf8a3-7e99-4213-bd90-451802d63be6', DB = '09b9df1d-2345-44c5-9e4e-6778e219fd7e';
const led = t => fs.appendFileSync(RUN + '/ledger.md', `- ${new Date().toISOString().slice(0, 19)}Z BS lane: ${t}\n`);
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const ok = (r, w) => { if (!r || r.s >= 300) throw new Error(w + ' ' + (r && r.s) + ' ' + (r && r.t.slice(0, 400))); return r; };
const E = r => r.s + (r.s >= 300 ? ' ' + JSON.stringify(r.j?.error || r.t).slice(0, 450) : '');
const u = Math.random().toString(36).slice(2, 6); const R = { u };
const dl = await api('GET', '/departments?page_size=200'); R.depts = arr(dl.j?.data).filter(x => [D, DB].includes(x.id)).map(x => [x.name, x.is_active ?? x.isActive]);
const pol = async (dept, n) => { const id = ok(await api('POST', '/desk/sla/policies', { department_id: dept, name: 'QA RT20 BS 2841 ' + n + ' ' + u, description: null, is_active: false, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: true, resolution_from_created: false, targets: [{ name: 't', criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: 'R20BS2841' + u }], pattern: null }, response: { value: 60, unit: 'minutes' }, resolution: { value: 3, unit: 'hours' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] }), 'pol').j.data.id; led(`SLA policy "QA RT20 BS 2841 ${n} ${u}" ${id} inactive`); return id; };
const pA = await pol(D, 'A'), pB = await pol(DB, 'B');
const plan = async (dept, p, n) => { const id = ok(await api('POST', '/desk/sla/support-plans', { department_id: dept, name: 'QA RT20 BS Plan 2841 ' + n + ' ' + u, description: null, policy_id: p, type: 'unlimited' }), 'plan').j.data.id; led(`support plan "QA RT20 BS Plan 2841 ${n} ${u}" ${id}`); return id; };
const planA = await plan(D, pA, 'A'), planB = await plan(DB, pB, 'B');
const acc = ok(await api('POST', '/modules/' + ACC + '/records', { data: [f('account_name', 'QA RT20 BS Account 2841 ' + u)] }), 'acc').j.data.id; led(`account "QA RT20 BS Account 2841 ${u}" ${acc}`);
const today = new Date().toISOString().slice(0, 10), later = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
const con = async (n, planId, dept = D) => { const r = await api('POST', '/modules/' + CON + '/records', { data: [f('contract_name', 'QA RT20 BS Contract 2841 ' + n + ' ' + u), ...(dept ? [f('department', dept)] : []), f('account_id', acc), ...(planId ? [f('support_plan', planId)] : []), f('start_date', today), f('end_date', later)] }); if (r.j?.data?.id) led(`contract "QA RT20 BS Contract 2841 ${n} ${u}" ${r.j.data.id}`); return r; };
const field = async (id, k) => ((await api('GET', '/modules/' + CON + '/records/' + id)).j?.data?.data || []).find(z => z.field === k)?.value?.value;
const cov = async id => (await api('GET', '/desk/sla/contracts/' + id + '/coverage')).j?.data?.plan?.name || 'none';
// 1 create with other dept plan, 3 repeats
R.c_other = []; for (let i = 0; i < 3; i++) { const r = await con('A with B plan try' + i, planB); R.c_other.push(E(r)); }
const search = await api('GET', '/modules/' + CON + '/records?search=' + encodeURIComponent('QA RT20 BS Contract 2841 A with B plan') + '&page_size=20'); R.c_other_found = arr(search.j?.data).length + ' (s ' + search.s + ')';
// 2 own plan
const c1 = await con('A own plan', planA); R.c_own = E(c1); const c1id = c1.j?.data?.id; R.c1_plan = (await field(c1id, 'support_plan')) === planA; R.c1_cov = await cov(c1id);
// 3 change plan to B via record PATCH
let r = await api('PATCH', '/modules/' + CON + '/records/' + c1id, { data: [f('support_plan', planB)] }); R.patch_plan_B = E(r); R.after_patch_plan = (await field(c1id, 'support_plan')) === planA ? 'still A' : 'CHANGED'; R.after_patch_cov = await cov(c1id);
// 4 attach via contract panel API
r = await api('PUT', '/desk/sla/contracts/' + c1id + '/plan', { plan_id: planB }); R.attach_B = E(r); R.after_attach_cov = await cov(c1id);
// 4b clear plan (null) then patch with B
// 5 move to Dept B together with B plan
const c2 = await con('A to move', planA); const c2id = c2.j?.data?.id; R.c2 = E(c2);
r = await api('PATCH', '/modules/' + CON + '/records/' + c2id, { data: [f('department', DB), f('support_plan', planB)] }); R.move_with_B = E(r); R.c2_dept = (await field(c2id, 'department')) === DB ? 'DB' : 'D'; R.c2_cov = await cov(c2id);
// 6 change only department of a contract with Dept A plan (dev: not refused)
const c3 = await con('A dept only change', planA); const c3id = c3.j?.data?.id; R.c3 = E(c3);
r = await api('PATCH', '/modules/' + CON + '/records/' + c3id, { data: [f('department', DB)] }); R.dept_only = E(r); R.c3_dept = (await field(c3id, 'department')) === DB ? 'DB' : 'D'; R.c3_cov = await cov(c3id);
// 7 no department + B plan (dev: accepted)
const c4 = await con('no dept with B plan', planB, null); R.no_dept = E(c4); if (c4.j?.data?.id) R.c4_cov = await cov(c4.j.data.id);
// 8 Arabic error via header
const rAr = await fetch; R.ids = { pA, pB, planA, planB, acc, c1id, c2id, c3id, c4id: c4.j?.data?.id };
fs.writeFileSync(RUN + '/scripts/bs/2841.json', JSON.stringify(R, null, 1)); return R;
