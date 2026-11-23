const DD = 'e04e88df-03e2-4a9f-8ccc-ff934cca500e', MM = '7e5e7c27-46e4-4bf6-b021-7bd219d34472'; const o = {};
const sts = () => [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 350, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 700, y: 0 } })];
// control: view-only member of CS as owner -> expect refused
const bad = await api('POST', `/modules/${TK}/blueprints`, { definition: DEF('3065 vo-owner-cs', sts(), [TR('vo', 'Open', 'Escalated', { before: { allowedUserIds: [MM] } })]), isActive: false });
o.saveViewOnlyCS = E(bad); if (bad.j?.data?.id) { made.bps.push(bad.j.data.id); keep(); LED('blueprint created (UNEXPECTED) ' + bad.j.data.id + ' vo-owner-cs'); }
// role case: my dept, CES2 owner (still normal member)
const a = await mkBp(DEF('3065 role', sts(), [TR('onlyA', 'Open', 'Escalated', { before: { allowedUserIds: [AG_A] } }), TR('shared', 'Open', 'Closed', { before: { allowedUserIds: [AG_A, OWNER] } }), TR('end', 'Escalated', 'Closed')], { departmentId: DD }));
o.roleBp = E(a.r); o.roleId = a.id;
// per-ticket case: CS, CES2 owner, ticket owned by owner
const b = await mkBp(DEF('3065 tk', sts(), [TR('onlyA', 'Open', 'Escalated', { before: { allowedUserIds: [AG_A] } }), TR('end', 'Escalated', 'Closed')]));
o.tkBp = E(b.r); o.tkId = b.id;
o.r1 = await mkT('3065 role', 'T1 owned by CES2', { owner: AG_A }, DD); o.r2 = await mkT('3065 role', 'T2 owned by owner', { owner: OWNER }, DD); o.r3 = await mkT('3065 role', 'T3 owned by owner', { owner: OWNER }, DD);
o.k1 = await mkT('3065 tk', 'K1 owned by owner', { owner: OWNER });
for (const k of ['r1', 'r2', 'r3', 'k1']) { await waitIn(o[k]); const r = await rec(o[k]); o[k + 'n'] = r.ticket_number + ' owner=' + (r.owner === OWNER ? 'OWNER' : r.owner === AG_A ? 'CES2' : r.owner) + ' st=' + r.status; }
fs.writeFileSync(RUN + '/scripts/bp/3065.json', JSON.stringify(o, null, 1)); return o;
