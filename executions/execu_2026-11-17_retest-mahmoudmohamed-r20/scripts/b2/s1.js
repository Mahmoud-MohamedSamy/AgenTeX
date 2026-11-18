const o = {}; const J = {};
const sts = () => [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 350, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 700, y: 0 } })];
const d = await api('POST', '/desk/departments', { name: 'QA RT20 B2 Dept', description: 'QA RT20 B2 retest - NDC-3065 second retest', agent_user_ids: [OWNER] });
const DD = d.j?.data?.id; o.dept = E(d); if (DD) { made.other.push({ dept: DD }); keep(); LED('department created ' + DD + ' "QA RT20 B2 Dept" agents owner only (' + d.s + ')'); }
J.DD = DD;
// case 1/2: CS blueprint, CES2 sole owner of onlyA
const a = await mkBp(DEF('tk', sts(), [TR('onlyA', 'Open', 'Escalated', { before: { allowedUserIds: [AG_A] } }), TR('end', 'Escalated', 'Closed')])); o.tk = E(a.r); J.tk = a.id;
// case 3: blueprint in my dept, CES2 (not a member) named owner by user list
const b = await mkBp(DEF('sh', sts(), [TR('onlyA', 'Open', 'Escalated', { before: { allowedUserIds: [AG_A] } }), TR('end', 'Escalated', 'Closed')], { departmentId: DD })); o.sh = E(b.r); J.sh = b.id;
// case 4: other-department owner (CS, CES2) named in Transition Owners at full / read_only
const c = await mkBp(DEF('xdf', sts(), [TR('xd', 'Open', 'Escalated', { before: { departmentOwners: [{ departmentId: CS, access: 'full', userIds: [AG_A], teamIds: [] }] } }), TR('end', 'Escalated', 'Closed')], { departmentId: DD })); o.xdf = E(c.r); J.xdf = c.id;
const e = await mkBp(DEF('xdr', sts(), [TR('xd', 'Open', 'Escalated', { before: { departmentOwners: [{ departmentId: CS, access: 'read_only', userIds: [AG_A], teamIds: [] }] } }), TR('end', 'Escalated', 'Closed')], { departmentId: DD })); o.xdr = E(e.r); J.xdr = e.id;
fs.writeFileSync(RUN + '/scripts/b2/3065.json', JSON.stringify(J, null, 1)); return o;
