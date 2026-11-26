// Does a department SLA apply at all in QA BP Reg Dept? Control ticket (no blueprint) vs blueprint ticket, same policy.
const g = 'SLC' + uid();
const pol = await api('POST', '/desk/sla/policies', { department_id: DEPT, name: 'QA BP R SLA ' + g, description: null, is_active: true, triggers: { create: true, update: true, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: true, targets: [{ name: 'QA BP R all ' + g, criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: g }], pattern: null }, response: { value: 30, unit: 'minutes' }, resolution: { value: 60, unit: 'minutes' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
const pid = pol.j?.data?.id; if (pid) { MADE.temp.push({ kind: 'sla', id: pid }); keep(); }
const pols = L((await api('GET', '/desk/sla/policies')).j?.data).filter(p => (p.department_id || p.departmentId) === DEPT).map(p => p.name + ' active ' + p.is_active);
await mkBp({ ...BASIC('BP' + g) });
const c = await mkT('X' + g, 'control no blueprint'); const b = await mkT('BP' + g, 'in blueprint ' + g); await waitIn(b);
let sc, sb; for (let i = 0; i < 12; i++) { sc = (await api('GET', `/desk/tickets/${c}/sla`)).j?.data; sb = (await api('GET', `/desk/tickets/${b}/sla`)).j?.data; if (sc?.state !== 'none' && sb?.state !== 'none') break; await sleep(5000); }
const ra = await api('POST', `/desk/tickets/${c}/sla/reapply`, {}); await sleep(5000); const sc2 = (await api('GET', `/desk/tickets/${c}/sla`)).j?.data;
const out = { policy: E(pol), deptPolicies: pols, control: sc?.state + ' ' + JS(sc?.policy).slice(0, 60), controlAfterReapply: E(ra) + ' ' + sc2?.state, blueprint: sb?.state + ' ' + JS(sb?.policy).slice(0, 60), subjects: [(await flds(c)).subject, (await flds(b)).subject] };
await cleanup();
return out;
