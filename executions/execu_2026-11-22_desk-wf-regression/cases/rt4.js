// AC-07 root cause test (23 Nov): role round robin uses the roles ABOVE the chosen role?
const CEO = '7972984b-b5cc-034a-bd96-6de61e3937d0', MGR = 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
const nm = { '876ce871-2b02-4854-89a7-68050391c62b': 'Test User 1', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4': 'Dev Team 2', '97be04b6-0a08-4883-aa51-e1650b11cab7': 'owner' };
const R = {}, TK = {};
for (const [k, role] of [['RTMGR', MGR], ['RTCEO', CEO]]) { const r = await mkRule(k, { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'OrgUnitRoundRobin', ownerValue: role }], { departmentIds: [DEPT2] }); R[k] = r.id; if (!r.id) return { save: k, s: r.s, err: r.err }; }
await sleep(3000);
for (const k of ['RTMGR', 'RTCEO']) { TK[k] = []; for (let i = 0; i < 3; i++) { TK[k].push((await mkTicket(k, { department: DEPT2 }, 'n' + i)).id); await sleep(2500); } }
await sleep(30000);
const out = {};
for (const k of ['RTMGR', 'RTCEO']) { out[k] = []; for (const t of TK[k]) { const o = (await getTicket(t)).owner; out[k].push((nm[o] || o || 'none') + ' | ' + (await execs(t, R[k])).flatMap(e => (e.dispatches || []).map(d => d.status + (d.lastError ? ' (' + String(d.lastError).slice(0, 100) + ')' : ''))).join(',')); } }
fs.writeFileSync(RUN + '/out/rt4.json', JSON.stringify({ R, TK, out }, null, 1));
return out;
