const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF E3odE', isActive: true, mode: 'Recurring', trigger: { kind: 'RecordUpdated' }, criteria: and(guard('QA WF E3odE '), { kind: 'Comparison', field: 'isOverdue', operator: 'Equal', negate: false, value: { kind: 'bool', boolValue: true } }), actions: [{ type: 'AddTicketComment', order: 0, commentBody: 'QA WF E3odE fired', commentPublic: false }] });
if (r.j?.data?.id) track('rule', r.j.data.id, 'E3odE');
const tk = (await mkTicket('E3odE', { due_date: new Date(Date.now() - 2 * 864e5).toISOString() })).id; await sleep(5000);
const p = await patchTicket(tk, { description: 'QA WF E3odE edit with past due date' }); await sleep(15000);
const fired = arr((await api('GET', `/desk/tickets/${tk}/comments`)).j?.data).filter(c => /fired/.test(c.body_html)).length;
const ex = arr((await api('GET', `/workflow/executions?recordId=${tk}`)).j?.data).map(e => e.ruleId.slice(0, 8) + ' ' + e.triggerKind + ' ' + e.outcome);
return fin({ rule: r.s, patch: p, fired, ex });
