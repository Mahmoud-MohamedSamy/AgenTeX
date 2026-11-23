const J = JSON.parse(fs.readFileSync(RUN + '/scripts/b2/3065.json', 'utf8')); const o = {}; const DD = J.DD;
const sts = () => [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 350, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 700, y: 0 } })];
const g0 = (await api('GET', '/desk/departments/' + DD)).j?.data; o.before = { agents: g0.agent_user_ids.map(x => x === OWNER ? 'OWNER' : x.slice(0, 8)), vo: g0.view_only_agent_user_ids };
let r = await api('PATCH', '/desk/departments/' + DD, { name: 'QA RT20 B2 Dept', agent_user_ids: [OWNER, AG_A], view_only_agent_user_ids: [] }); o.addMember = E(r); LED('CES2 added to QA RT20 B2 Dept ' + DD + ' as normal member: ' + r.s + ' (restore: remove at end)');
const a = await mkBp(DEF('vo', sts(), [TR('onlyA', 'Open', 'Escalated', { before: { allowedUserIds: [AG_A] } }), TR('shared', 'Open', 'Closed', { before: { allowedUserIds: [AG_A, OWNER] } }), TR('end', 'Escalated', 'Closed')], { departmentId: DD })); o.voBp = E(a.r); J.vo = a.id;
const b = await mkBp(DEF('dyn', sts(), [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')], { dynamicOwners: true, departmentId: DD })); o.dynBp = E(b.r); J.dyn = b.id;
J.t.V1 = await mkT('vo', 'V1 owned by owner', { owner: OWNER }, DD); J.t.V2 = await mkT('vo', 'V2 owned by CES2', { owner: AG_A }, DD); J.t.D1 = await mkT('dyn', 'D1', {}, DD);
for (const k of ['V1', 'V2', 'D1']) { await waitIn(J.t[k], 30); J.n[k] = '#' + (await api('GET', '/desk/tickets/' + J.t[k])).j?.data?.ticket_number; }
r = await api('PATCH', '/desk/departments/' + DD, { name: 'QA RT20 B2 Dept', agent_user_ids: [OWNER, AG_A], view_only_agent_user_ids: [AG_A] }); o.setVO = E(r);
const g = (await api('GET', '/desk/departments/' + DD)).j?.data; o.vo = g.view_only_agent_user_ids.map(x => x === AG_A ? 'CES2' : x); if (o.vo.includes('CES2')) LED('CES2 set VIEW-ONLY in QA RT20 B2 Dept ' + DD + ' (restore: remove at end)');
fs.writeFileSync(RUN + '/scripts/b2/3065.json', JSON.stringify(J, null, 1)); await sleep(3000);
// 5a save with view-only owner
const bad = await api('POST', `/modules/${TK}/blueprints`, { definition: DEF('vo-bad', sts(), [TR('x', 'Open', 'Escalated', { before: { allowedUserIds: [AG_A] } }), TR('end', 'Escalated', 'Closed')], { departmentId: DD }), isActive: false });
o.saveVO = E(bad); if (bad.j?.data?.id) { made.bps.push(bad.j.data.id); keep(); LED('blueprint created (UNEXPECTED) ' + bad.j.data.id + ' vo-bad inactive'); }
const MM = '7e5e7c27-46e4-4bf6-b021-7bd219d34472';
const bad2 = await api('POST', `/modules/${TK}/blueprints`, { definition: DEF('vo-cs', sts(), [TR('x', 'Open', 'Escalated', { before: { allowedUserIds: [MM] } }), TR('end', 'Escalated', 'Closed')]), isActive: false });
o.saveVOcs = E(bad2); if (bad2.j?.data?.id) { made.bps.push(bad2.j.data.id); keep(); LED('blueprint created (UNEXPECTED) ' + bad2.j.data.id + ' vo-cs inactive'); }
// 5b eligible owners
for (const [k, d] of [['cs', CS], ['mine', DD]]) { const e = await api('GET', '/desk/departments/' + d + '/eligible-owners'); const s = JSON.stringify(e.j?.data || e.t); o['elig_' + k] = e.s + ' hasMM=' + s.includes(MM) + ' hasCES2=' + s.includes(AG_A) + ' n=' + L(e.j?.data).length; }
// 5c ticket owners
const put = (id, tr, u) => api('PUT', `/modules/${TK}/records/${id}/blueprint/owners/${tr}`, { userIds: u, teamIds: [], departmentOwners: [] });
o.putCES2 = E(await put(J.t.D1, 'go', [AG_A])); o.putOwner = E(await put(J.t.D1, 'go', [OWNER]));
// pre-saved owner marked
const bp = await getBp(J.vo); o.ownerIssues = JSON.stringify(bp.ownerIssues).slice(0, 300); o.noActive = bp.transitionsWithoutActiveOwner;
o.ownerTransV1 = await trans(J.t.V1);
return o;
