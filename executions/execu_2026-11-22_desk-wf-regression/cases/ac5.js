const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7', ORG = '7972984b-b5cc-034a-bd96-6de61e3937d0';
const nm = { [TU1]: 'TestUser1', [DEV2]: 'DevTeam2', [OWN]: 'owner' };
const r = await mkRule('AC5ou', { kind: 'RecordUpdated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'OrgUnitRoundRobin', ownerValue: ORG }], { criteria: cmp('classification', 'Equal', S('others')) });
const ts = []; for (let i = 0; i < 4; i++) ts.push(await mkTicket('AC5ou', { department: DEPT2 }, 'n' + i));
await sleep(20000);
const h0 = arr((await api('GET', `/desk/tickets/${ts[0].id}/history`)).j.data).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + ' old=' + JSON.stringify(x.old_value) + ' new=' + JSON.stringify(x.new_value));
for (const t of ts) { await patchTicket(t.id, { classification: 'others' }); await sleep(4000); }
await sleep(30000);
const res = []; for (const t of ts) { const o = (await getTicket(t.id)).owner; res.push((nm[o] || o || 'none') + ' ' + (await execs(t.id, r.id)).flatMap(e => (e.dispatches || []).map(d => d.status + (d.lastError ? ' ' + String(d.lastError).slice(0, 100) : ''))).join(',')); }
return { createHistory: h0, owners: res };
