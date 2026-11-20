const DD = 'e04e88df-03e2-4a9f-8ccc-ff934cca500e'; const o = {};
let r = await api('PATCH', '/desk/departments/' + DD, { name: 'QA RT20 BP Dept', agent_user_ids: [OWNER, AG_A], view_only_agent_user_ids: [AG_A] }); o.patch = E(r);
const g = (await api('GET', '/desk/departments/' + DD)).j?.data; o.agents = g.agent_user_ids; o.vo = g.view_only_agent_user_ids;
if ((o.vo || []).includes(AG_A)) LED('CES2 (9d182dfa) set VIEW-ONLY in QA RT20 BP Dept e04e88df (restore: remove view-only at end)');
await sleep(3000);
const bp = await getBp('f2b2c1f5-56fd-4098-91e8-8a8704f78898'); o.ownerIssues = bp.ownerIssues; o.noActive = bp.transitionsWithoutActiveOwner;
const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8'));
for (const k of ['r1', 'r2', 'r3', 'k1']) { o[k + 'n'] = (await api('GET', '/desk/tickets/' + J[k])).j?.data?.ticket_number; o[k + 'Owner'] = await trans(J[k]); }
Object.assign(J, { n: { r1: o.r1n, r2: o.r2n, r3: o.r3n, k1: o.k1n } }); fs.writeFileSync(RUN + '/scripts/bp/3065.json', JSON.stringify(J, null, 1));
return o;
