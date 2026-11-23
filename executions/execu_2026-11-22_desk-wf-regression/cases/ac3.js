const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7', ORG = '7972984b-b5cc-034a-bd96-6de61e3937d0';
const tagC = '7397b50e-30dd-4ebb-9abf-7e9468a7cc82', tagD = 'ba388a87-99b7-491e-ab91-2bba95ccd60a';
const out = {};
const bad = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF P16', isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: guard('QA WF P16 '), actions: [{ order: 0, type: 'OwnerAssignment', ownerTargetKind: 'Bogus', ownerValue: 'x' }], departmentIds: [DEPT2] });
out.kinds = (bad.j?.error?.details || []).map(d => d.issue).join(' | ');
const rO = await mkRule('AC3o', { kind: 'RecordUpdated' }, [{ type: 'AddTags', tagIds: [tagD], mode: 'overwrite' }]);
const rRR = await mkRule('AC3rr', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'RoleRoundRobin', ownerValue: ORG }]);
const rOU = await mkRule('AC3ou', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'OrgUnit', ownerValue: ORG }]);
const rUF = await mkRule('AC3uf', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'UserField', ownerValue: 'created_by' }]);
out.save = { o: rO.s + ' ' + (rO.err || ''), rr: rRR.s + ' ' + (rRR.err || ''), ou: rOU.s + ' ' + (rOU.err || ''), uf: rUF.s + ' ' + (rUF.err || '') };
const tO = rO.id ? await mkTicket('AC3o', { department: DEPT2 }) : {};
const rr = []; if (rRR.id) for (let i = 0; i < 4; i++) rr.push(await mkTicket('AC3rr', { department: DEPT2 }, 'n' + i));
const tOU = rOU.id ? await mkTicket('AC3ou', { department: DEPT2 }) : {}; const tUF = rUF.id ? await mkTicket('AC3uf', { department: DEPT2 }) : {};
await sleep(20000);
if (tO.id) { await api('POST', `/desk/tickets/${tO.id}/tags`, { tag_ids: [tagC] }); await sleep(8000); await patchTicket(tO.id, { classification: 'others' }); }
await sleep(35000);
const nm = { [TU1]: 'TestUser1', [DEV2]: 'DevTeam2', [OWN]: 'owner' };
const own = async t => { const o = (await getTicket(t.id)).owner; return nm[o] || o || 'none'; };
const dsp = async (t, r) => (await execs(t.id, r.id)).flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status + (d.lastError ? ' (' + String(d.lastError).slice(0, 140) + ')' : '')));
if (tO.id) out.overwrite = { tags: (await getTicket(tO.id)).tags, dispatch: await dsp(tO, rO) };
if (rr.length) { out.roleRR = []; for (const t of rr) out.roleRR.push(await own(t) + ' ' + (await dsp(t, rRR)).join(',')); }
if (tOU.id) out.orgUnit = await own(tOU) + ' ' + (await dsp(tOU, rOU)).join(',');
if (tUF.id) out.userField = await own(tUF) + ' ' + (await dsp(tUF, rUF)).join(',');
fs.writeFileSync(RUN + '/out/ac3.json', JSON.stringify(out, null, 1));
return out;
