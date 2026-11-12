// I10: direct assignment rule (Dept A, description contains KEY -> Test User 1) + workflow Owner Assignment (-> Mahmoud Samy), both On Create.
const KEY = 'QAAOI10' + Date.now().toString(36); const NM = { [A1]: 'Test User 1', [SAMY]: 'Mahmoud Samy', [OWNER]: 'owner' }; const R = { key: KEY };
const ar = await api('POST', '/desk/assignment-rules', { type: 'direct', name: 'QA AO WF I10 assign', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: KEY }], pattern: null }, coming_to_department_id: D, move_to_department_id: null, assign: { kind: 'agent', user_id: A1, team_id: null } }] });
R.assignRule = ar.s + (ar.s >= 300 ? ' ' + ar.t.slice(0, 250) : ''); const ARID = ar.j?.data?.id;
const wr = await mkRule('I10', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: SAMY }]); R.wfRule = wr.s;
fs.writeFileSync('../a4/i10.json', JSON.stringify({ ARID, wr: wr.id }));
const t = await mkTicket('I10', { description: KEY, owner: null }, 'both apply'); await sleep(20000);
const g = await getTicket(t.id); R.finalOwner = NM[g.owner] || g.owner || 'none';
R.history = arr((await api('GET', `/desk/tickets/${t.id}/history`)).j?.data).reverse().map(x => x.occurred_at.slice(11, 23) + ' ' + x.action + ':' + (x.field_key || '') + ':' + (NM[x.new_value] || String(x.new_value || '').slice(0, 10)) + ' by ' + (x.actor?.kind || '') + (x.source ? '/' + x.source : ''));
R.activity = arr((await api('GET', `/desk/tickets/${t.id}/activity`)).j?.data).reverse().map(x => x.occurred_at.slice(11, 23) + ' ' + x.action).filter(x => /assign|owner|workflow/i.test(x));
fs.writeFileSync('../a4/i10.json', JSON.stringify({ ARID, wr: wr.id, t: t.id, R }, null, 1)); log(JSON.stringify(R, null, 1));
