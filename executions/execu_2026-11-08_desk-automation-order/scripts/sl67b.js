// SL-67 (owner; user approved 9 Nov 2026, "run it and clean up what you created"): 300 open QA tickets under one SLA policy in QA AO Dept A.
// Times: ticket creation, SLA list load, ticket list load, "reapply to open tickets". Then deletes the tickets, the policy, and any tasks
// another user's workflow rule created on these tickets.
const A = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', M = '88e8ea44-1658-4df3-9930-d0902b91073d', TASKS = 'd120a6c2-2596-4254-968b-a1bcd3a000bf';
const N = 60, CONC = 6;
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const u = Math.random().toString(36).slice(2, 6), tag = 'SL67' + u; const R = { tag };
const time = async (fn) => { const t = Date.now(); const r = await fn(); return [Date.now() - t, r]; };
const pool = async (items, fn) => { const out = []; let i = 0; await Promise.all(Array.from({ length: CONC }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } })); return out; };
const ids = [];
let pid = null;
try {
  const p = await api('POST', '/desk/sla/policies', { department_id: A, name: 'QA AO ' + tag, description: null, is_active: true, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: false, targets: [{ name: 't ' + tag, criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: tag }], pattern: null }, response: { value: 8, unit: 'hours' }, resolution: { value: 3, unit: 'days' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
  pid = p.j?.data?.id; R.policy = p.s;
  const [ms, res] = await time(() => pool(Array.from({ length: N }, (_, k) => k), async k => { const r = await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO ' + tag + ' #' + k), f('description', 'QA AO ' + tag), f('department', A), f('status', 'Open'), f('priority', 'medium')] }); if (r.j?.data?.id) ids.push(r.j.data.id); return r.s; }));
  R.create = { ms, ok: res.filter(s => s < 300).length, failed: res.filter(s => s >= 300).length, perTicketMs: Math.round(ms / N) };
  await sleep(30000);
  await sleep(150000); const sample = ids;
  R.appliedSample = (await pool(sample, async id => (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data?.state)).reduce((a, s) => (a[s] = (a[s] || 0) + 1, a), {});
  const [l1] = await time(() => api('GET', '/desk/sla/policies?department_id=' + A)); R.slaListMs = l1;
  const [l2, lr] = await time(() => api('GET', '/modules/' + M + '/records?page=1&page_size=100')); R.ticketListMs = l2; R.ticketListStatus = lr.s;
  const [l3, ro] = await time(() => api('POST', '/desk/sla/policies/' + pid + '/reapply-open', {})); R.reapply = { ms: l3, status: ro.s, body: ro.t.slice(0, 300) };
  await sleep(60000);
  R.afterReapplySample = (await pool(sample, async id => { const s = (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data; return s?.state + ' exec' + s?.execution?.number; })).reduce((a, s) => (a[s] = (a[s] || 0) + 1, a), {});
  const [l4] = await time(() => api('GET', '/desk/sla/policies?department_id=' + A)); R.slaListAfterMs = l4;
} catch (e) { R.error = e.message; }
// cleanup
const set = new Set(ids);
let tasks = [];
for (let pg = 1; pg <= 30; pg++) { const r = await api('GET', '/modules/' + TASKS + '/records?page=' + pg + '&page_size=100'); const L = arr(r.j?.data); if (!L.length) break; tasks = tasks.concat(L.filter(x => (x.data || []).some(d => d.field === 'ticket_id' && set.has(d.value?.value))).map(x => x.id)); if (L.length < 100) break; }
R.workflowTasksOnMyTickets = tasks.length;
const dt = await pool(tasks, async id => (await api('DELETE', '/modules/' + TASKS + '/records/' + id)).s);
const dk = await pool(ids, async id => (await api('DELETE', '/modules/' + M + '/records/' + id)).s);
R.cleanup = { tasksDeleted: dt.filter(s => s < 300).length, ticketsDeleted: dk.filter(s => s < 300).length, ticketFailures: dk.filter(s => s >= 300).length, policy: pid ? (await api('DELETE', '/desk/sla/policies/' + pid)).s : null };
fs.writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-08_desk-automation-order/sl67b-result.json', JSON.stringify(R, null, 1));
return R;
