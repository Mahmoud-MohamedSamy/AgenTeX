const L = []; const D = IDS.DA; const S = x => String(JSON.stringify(x === undefined ? null : x)).slice(0, 220);
const r = await mkRule({ type: 'direct', name: 'QA AR C07 both', description: 'QA', is_active: true, execute_on: ['create'], targets: [DT('QA AR C07', D, null, { kind: 'agent', user_id: IDS.A1, team_id: IDS.TA })] });
const g = await getRule(r.id); const id = (await mkTicket('QA AR C07 x', D)).id; await sleep(5000); const t = await getT(id);
L.push(R_('C-07', 'Info', 'API accepts a target with kind agent + team_id (6 Nov: 400). Stored target ' + S(g.targets[0].assign) + '; ticket → owner ' + await ownN(id) + ', team ' + S(t.team || t.team_id)));
await setActive(r.id, false);
// F-12 / C-08 Team Assignment switch off
const ta0 = (await api('GET', '/desk/departments/' + D + '/team-assignment')).j.data; const off = sh(await api('PUT', '/desk/departments/' + D + '/team-assignment', { ...ta0, enabled: false })); LED('Dept A team assignment OFF (restore ON)');
const rt = await api('POST', '/desk/assignment-rules', { type: 'direct', name: 'QA AR C08 team', description: 'QA', is_active: true, execute_on: ['create'], targets: [DT('QA AR C08', D, null, TM(IDS.TA))] }); if (rt.j?.data?.id) LED('rule direct "QA AR C08 team" ' + rt.j.data.id);
const rr = await api('POST', '/desk/assignment-rules', { type: 'round_robin', department_id: D, name: 'QA AR C08 rr team', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: SW('QA AR C08R'), method: 'sequential', pool: { kind: 'team', user_ids: [], team_id: IDS.TA, excluded_user_ids: [] } }] }); if (rr.j?.data?.id) LED('rule rr "QA AR C08 rr team" ' + rr.j.data.id);
const tid = (await mkTicket('QA AR C08 manual', D)).id; const man = sh(await api('POST', '/desk/tickets/' + tid + '/assign', { owner_id: null, team_id: IDS.TA }));
const d05 = (await getT('72dd704a-1707-40b3-aa72-835dc3eb0afa')); 
const on = sh(await api('PUT', '/desk/departments/' + D + '/team-assignment', { ...ta0, enabled: true })); LED('Dept A team assignment restored ON');
L.push(R_('F-12', rt.s >= 400 && rr.s >= 400 && man.s >= 400 ? 'Pass' : 'Fail', 'Team Assignment off (' + off.s + '): new direct rule with team target → ' + rt.s + ' ' + (E(rt) || '').slice(0, 80) + '; RR team pool → ' + rr.s + ' ' + (E(rr) || '').slice(0, 80) + '; manual assign to team → ' + man.s + ' ' + (man.e || '').slice(0, 80) + ' (NDC-2812); restored (' + on.s + ')'));
L.push(R_('F-13', JSON.stringify(d05).includes(IDS.TA) && !d05.owner ? 'Pass' : 'Fail', 'Team ticket D05 (team, no RR team rule) stays in the team queue with no owner: owner ' + S(d05.owner) + ', team ' + S(d05.team || d05.team_id)));
return L;
