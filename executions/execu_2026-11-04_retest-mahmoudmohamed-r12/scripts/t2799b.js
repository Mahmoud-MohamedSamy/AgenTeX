const o = {}; const B = 'b1d51be9-6ef1-4c31-9a7e-d5293af29985';
const uuid = () => require('crypto').randomUUID(); const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''} ${r.j?.error?.details ? JSON.stringify(r.j.error.details).slice(0, 200) : ''}`.trim();
const g = await api('o', 'GET', `desk:/modules/${X.TK}/blueprints/${B}`); o.active = g.j.data.isActive;
if (!o.active) { for (const p of [`desk:/modules/${X.TK}/blueprints/${B}/activate`, `desk:/desk/blueprints/${B}/activate`]) { const r = await api('o', 'POST', p, {}); o['act ' + p.split('/').slice(-2).join('/')] = r.s; if (r.s < 300) break; } if (!(await api('o', 'GET', `desk:/modules/${X.TK}/blueprints/${B}`)).j.data.isActive) { const r = await api('o', 'PUT', `desk:/modules/${X.TK}/blueprints/${B}`, { definition: g.j.data.definition, isActive: true }); o.putActive = r.s; } o.activeNow = (await api('o', 'GET', `desk:/modules/${X.TK}/blueprints/${B}`)).j.data.isActive; }
const run = (who, tid, extra = {}) => api(who, 'POST', `desk:/desk/tickets/${tid}/blueprint-transitions/go`, { run_id: uuid(), expected_state_id: 'Open', fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...extra });
const mk = async (who, s) => { const r = await api(who, 'POST', `desk:/modules/${X.TK}/records`, { data: [{ field: 'subject', value: { kind: 'string', value: 'QA RT12 2799 ' + s } }, { field: 'department', value: { kind: 'string', value: X.ids.DEPT_A } }, { field: 'status', value: { kind: 'string', value: 'Open' } }] }); const id = r.j?.data?.id; if (id) ledger(`ticket "QA RT12 2799 ${s}" ${id} (by ${who})`); return id; };
const tEsc = await mk('o', 'escalation'); o.escCreatedAt = new Date().toISOString();
const tA3 = await mk('a', 'custom mandatory agent'); const tO = await mk('o', 'custom mandatory owner'); await sleep(8000);
const s = async id => { const x = await X.state(id); return x ? (x.activeStates || []).join(',') : 'none'; };
o.inBp = { esc: await s(tEsc), a3: await s(tA3), o: await s(tO) };
o.a3_noAmount = full(await run('a', tA3)); o.a3_withAmount = full(await run('a', tA3, { fields: { qa_ndc_amount: 3 } }));
o.o_noAmount = full(await run('o', tO)); o.after = { a3: await s(tA3), o: await s(tO) };
o.ids = { tEsc, tA3, tO };
return o;
