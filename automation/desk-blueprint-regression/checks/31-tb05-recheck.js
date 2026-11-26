// TB-05 recheck: other-department owner at Full access.
const tech = await deptGet(TECH);
const out = { cInTech: tech.agent_user_ids.includes(U.C), cViewOnlyInTech: (tech.view_only_agent_user_ids || []).includes(U.C) };
const g = 'TB5R' + uid();
await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { before: { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [U.C], teamIds: [] }] } }), TR('end', 'Escalated', 'Closed')]));
const t = await mkT(g); await waitIn(t);
for (const w of [3, 15, 40]) {
  await sleep(w * 1000);
  const tk = await C('GET', `/desk/tickets/${t}`), tr = await C('GET', `/modules/${T}/records/${t}/blueprint-transitions`), bs = await C('GET', `/modules/${T}/records/${t}/blueprint-state`);
  out['after' + w + 's'] = { ticket: tk.s, transitions: tr.s + ' ' + JSON.stringify(tr.j?.data || tr.j?.error).slice(0, 220), state: bs.s };
}
out.shares = L((await api('GET', `/desk/tickets/${t}/shares`)).j?.data).map(s => ({ d: s.department_name || s.department_id, a: s.access, by: s.shared_by_name || s.reason || s.source }));
const r = await runT(t, 'go', 'Open', {}, C); out.cRun = E(r);
// same with the owner listed as a team of Tech instead of the user
const teams = (await api('GET', '/desk/teams')).j?.data?.teams || [];
const techTeam = teams.find(x => x.department_id === TECH && (x.sources || []).some(s => s.ref_id === U.C));
out.techTeamWithC = techTeam ? techTeam.name : null;
if (techTeam) {
  const g2 = 'TB5T' + uid(); await mkBp(DEF(g2, S3(), [TR('go', 'Open', 'Escalated', { before: { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [], teamIds: [techTeam.id] }] } }), TR('end', 'Escalated', 'Closed')]));
  const t2 = await mkT(g2); await waitIn(t2); await sleep(8000);
  out.teamOwner = { sees: (await transIds(t2, C)).join(',') || '-', run: E(await runT(t2, 'go', 'Open', {}, C)) };
}
// blueprint-level other dept owner
const g3 = 'TB5L' + uid(); await mkBp({ ...BASIC(g3), transitionOwners: { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [U.C], teamIds: [] }] } });
const t3 = await mkT(g3); await waitIn(t3); await sleep(8000);
out.blueprintLevel = { sees: (await transIds(t3, C)).join(',') || '-', run: E(await runT(t3, 'go', 'Open', {}, C)) };
await cleanup();
return out;
