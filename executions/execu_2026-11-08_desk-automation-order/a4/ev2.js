// Recheck Z18 (two actions of one type) and B-2 (Field Update on created_by) by API; read the rules saved on screen.
const S = v => ({ kind: 'string', stringValue: v });
const R = {};
const all = arr((await api('GET', '/workflow/rules?take=200')).j?.data);
for (const r of all.filter(x => /^QA AO WF EV(2|4|10)/.test(x.name || ''))) {
  const g = (await api('GET', '/workflow/rules/' + r.id)).j?.data || r; track('rule', r.id, 'EVui');
  R['ui_' + r.name.slice(0, 40)] = { id: r.id, actions: (g.actions || []).map(a => a.type + ':' + JSON.stringify(a.fieldUpdates || {}).slice(0, 120)) };
}
const z = await mkRule('EV2api', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', fieldUpdates: { description: S('one') } }, { type: 'FieldUpdate', fieldUpdates: { priority: S('high') } }], { isActive: false });
R.Z18_twoFieldUpdates = z.s + ' ' + (z.err || 'saved');
const z2 = await mkRule('EV2task', { kind: 'RecordCreated' }, [{ type: 'Task', taskTitle: 'QA AO WF EV2 t1', taskStatus: 'Not Started', taskPriority: 'Normal' }, { type: 'Task', taskTitle: 'QA AO WF EV2 t2', taskStatus: 'Not Started', taskPriority: 'Normal' }], { isActive: false });
R.Z18_twoTasks = z2.s + ' ' + (z2.err || 'saved');
const b2 = await mkRule('EV3api', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', fieldUpdates: { created_by: S('97be04b6-0a08-4883-aa51-e1650b11cab7') } }], { isActive: false });
R.B2_createdBy = b2.s + ' ' + (b2.err || 'saved');
const b2b = await mkRule('EV3num', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', fieldUpdates: { ticket_number: S('1') } }], { isActive: false });
R.B2_ticketNumber_control = b2b.s + ' ' + (b2b.err || 'saved');
fs.writeFileSync('../a4/ev2-out.json', JSON.stringify(R, null, 1));
log(JSON.stringify(R, null, 1));
