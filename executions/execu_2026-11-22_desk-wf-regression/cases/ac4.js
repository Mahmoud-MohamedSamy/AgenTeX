const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7', ORG = '7972984b-b5cc-034a-bd96-6de61e3937d0';
const nm = { [TU1]: 'TestUser1', [DEV2]: 'DevTeam2', [OWN]: 'owner' };
const users = arr((await api('GET', '/iam/users?take=200')).j.data).filter(u => u.orgUnitId === ORG).map(u => u.displayName + (u.status !== 'active' ? '(' + u.status + ')' : ''));
const r = await mkRule('AC4ou', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'OrgUnitRoundRobin', ownerValue: ORG }]);
if (!r.id) return { save: r.s, err: r.err };
const ts = []; for (let i = 0; i < 4; i++) { ts.push(await mkTicket('AC4ou', { department: DEPT2 }, 'n' + i)); await sleep(3000); }
await sleep(40000);
const res = []; for (const t of ts) { const o = (await getTicket(t.id)).owner; res.push((nm[o] || o || 'none') + ' ' + (await execs(t.id, r.id)).flatMap(e => (e.dispatches || []).map(d => d.status + (d.lastError ? ' ' + String(d.lastError).slice(0, 120) : ''))).join(',')); }
return { roleMembers: users, owners: res };
