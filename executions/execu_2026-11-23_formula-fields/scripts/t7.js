const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'; const res = {};
const ST = id => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar' });
const def = { name: 'QA FX H9 Tickets', description: 'QA FX run - delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA FX H9 ' },
  states: [ST('Open'), ST('On Hold')], transitions: [{ id: 't1', name: 'QA hold', fromStateId: 'Open', toStateId: 'On Hold', before: {}, during: { requiredFields: [{ name: 'priority', required: true, datatype: { key: 'pick_list' } }], checklist: [] }, after: { actions: [] } }] };
const b = await api('POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); res.bp = E(b).slice(0, 300); if (b.j?.data?.id) { made.tickets.bps = [b.j.data.id]; keep(); led('Desk Tickets blueprint ' + b.j.data.id); }
const t = await api('POST', `/modules/${TK}/records`, { data: data({ subject: 'QA FX H9 ticket', description: 'QA FX run - delete', status: 'Open', department: CS, priority: 'Low' }) }); const id = t.j?.data?.id; made.tickets.tickets.push(id); keep();
let st; for (let i = 0; i < 10; i++) { await sleep(2500); st = await api('GET', `/modules/${TK}/records/${id}/blueprint-state`); if (/Open/.test(JSON.stringify(st.j?.data || ''))) break; } res.inBlueprint = /QA FX H9 Tickets/.test(JSON.stringify(st.j?.data || ''));
const before = await getRec(TK, id); res.before = { priority: before.priority, qa_fx_hi: before.qa_fx_hi };
for (const [p, body] of [['/desk/tickets/' + id + '/blueprint-transitions/t1', { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: { priority: 'High' } }], [`/modules/${TK}/records/${id}/blueprint-transitions/t1`, { priority: 'High' }]]) { const x = await api('POST', p, body); res['exec ' + p.split('/')[1]] = E(x).slice(0, 200); if (x.s < 300) break; }
await sleep(4000); const v = await getRec(TK, id); res.after = { status: v.status, priority: v.priority, qa_fx_hi: v.qa_fx_hi };
res.verdict = /high/i.test(v.priority || '') ? (v.qa_fx_hi === true ? 'PASS' : 'FAIL (formula not recalculated after transition)') : 'BLOCKED';
log(JSON.stringify(res, null, 1));
