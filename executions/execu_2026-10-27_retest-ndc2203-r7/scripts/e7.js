const TEAM = '1adfefb7-0c25-4484-ae92-782964695054';
const r = await mkRule('D1e', { kind: 'RecordUpdated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: TEAM }]);
const tk = await mkTicket('D1e'); await sleep(4000); const before = await getTicket(tk.id);
const p = await patchTicket(tk.id, { description: 'QA WF D1e edit to fire' }); await sleep(12000);
const after = await getTicket(tk.id);
const ex = arr((await api('GET', `/workflow/executions?recordId=${tk.id}`)).j?.data).filter(e => e.ruleId === r.id).map(e => [e.outcome, e.criteriaMatched, e.errorMessage, (e.dispatches || []).length].join(' '));
return fin({ rule: r, ticket: tk.id, before: { owner: before.owner, team: before.team }, patch: p, after: { owner: after.owner, team: after.team }, ex });
