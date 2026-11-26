// TB-05 with a real Tech agent (Mahmoud TAVIPortal, Desk Supervisor, Tech only) + finding on non-member owners.
const tech = await deptGet(TECH);
const inTech = tech.agent_user_ids.includes(U.C);
const g = 'TB5' + uid();
await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { before: { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [U.C], teamIds: [] }] } }), TR('end', 'Escalated', 'Closed')]));
const t = await mkT(g); await waitIn(t); await sleep(4000);
const sh1 = L((await api('GET', `/desk/tickets/${t}/shares`)).j?.data).filter(s => s.department_id === TECH).map(s => s.access);
const sees = (await transIds(t, C)).join(',') || '-';
const r = await runT(t, 'go', 'Open', {}, C); await sleep(4000);
const after = st(await bstate(t));
const sh2 = L((await api('GET', `/desk/tickets/${t}/shares`)).j?.data).filter(s => s.department_id === TECH).map(s => s.access);
const prev = (await api('GET', `/desk/tickets/${t}`)).j?.data;
R('TB-05', inTech && sees === 'go' && ok(r) && after === 'Escalated' ? 'PASS' : 'FAIL', `C in Tech ${inTech}; Read only/Restricted + required reply/resolution/approval refused at save (BLUEPRINT_OWNER_CANNOT_REPLY, from 30-before); Full: shared while in Open [${sh1}], C sees ${sees}, C runs ${E(r)} → ${after}; Tech share after leaving the state [${sh2}]`);
R('RN-16', ok(r) && after === 'Escalated' ? (sh2.length ? 'PASS' : 'PASS') : 'FAIL', `cross-department owner ran the step on the shared ticket (${E(r)}); share after leaving the state: ${sh2.length ? 'kept [' + sh2 + ']' : 'removed'}`);
// finding: owner listed under a department they do not belong to
const notMember = await mkBp(DEF('TB5N' + uid(), S3(), [TR('go', 'Open', 'Escalated', { before: { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [U.C1], teamIds: [] }] } }), TR('end', 'Escalated', 'Closed')]), false);
R('TB-12', notMember.ok ? 'FINDING' : 'PASS', `owner listed under Tech who is not a Tech agent (Test User 1): ${notMember.ok ? 'SAVED with no warning; at runtime that user never sees the step (BLUEPRINT_NOT_OWNER) although the ticket is shared to Tech' : 'refused ' + code(notMember.r)}`, { extra: 'not in case list; added' });
return await cleanup();
