const J = JSON.parse(fs.readFileSync(RUN + '/scripts/b2/3065.json', 'utf8')); const o = {}; const DD = J.DD;
const sts = () => [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 350, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 700, y: 0 } })];
o.bad1 = made.bps[made.bps.length - 1]; const b1 = await getBp(o.bad1); o.bad1Name = b1?.definition?.name; o.bad1Issues = JSON.stringify(b1?.ownerIssues || '').slice(0, 300); o.bad1Active = b1?.isActive;
const g = (await api('GET', '/desk/departments/' + DD)).j?.data; o.vo = g.view_only_agent_user_ids.map(x => x === AG_A ? 'CES2' : x); o.agents = g.agent_user_ids.length;
const bad = await api('POST', `/modules/${TK}/blueprints`, { definition: DEF('vo-bad2', sts(), [TR('x', 'Open', 'Escalated', { before: { allowedUserIds: [AG_A] } }), TR('end', 'Escalated', 'Closed')], { departmentId: DD }), isActive: false });
o.saveVO_again = E(bad); if (bad.j?.data?.id) { made.bps.push(bad.j.data.id); keep(); LED('blueprint created (UNEXPECTED) ' + bad.j.data.id + ' "QA RT20 B2 vo-bad2" inactive'); }
const put = (id, tr, u) => api('PUT', `/modules/${TK}/records/${id}/blueprint/owners/${tr}`, { userIds: u, teamIds: [], departmentOwners: [] });
o.putCES2_again = E(await put(J.t.D1, 'go', [AG_A])); const own = await api('GET', `/modules/${TK}/records/${J.t.D1}/blueprint/owners`); o.ownersD1 = own.s + ' ' + JSON.stringify(own.j?.data || '').replace(new RegExp(AG_A, 'g'), 'CES2').replace(new RegExp(OWNER, 'g'), 'OWNER').slice(0, 300);
o.putOwner = E(await put(J.t.D1, 'go', [OWNER]));
const bp = await getBp(J.vo); o.voIssues = JSON.stringify(bp.ownerIssues).slice(0, 300); o.voNoActive = bp.transitionsWithoutActiveOwner;
return o;
