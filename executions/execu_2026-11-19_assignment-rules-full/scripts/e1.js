const L = []; const base = JSON.parse(fs.readFileSync(RUN + '/out/prefsDA-before.json', 'utf8'));
L.push(await prefsS(IDS.DA, { ...base, assign_to_offline_agents: true }));
const team = (await api('GET', '/desk/teams/' + IDS.TA)).j?.data; L.push({ team: team && { name: team.name, members: (team.member_user_ids || team.user_ids || team.members || []).map(m => nmU(m.user_id || m.id || m)) } });
// E-02 / E-04 validation
const v = async b => { const r = await api('POST', '/desk/assignment-rules', { type: 'round_robin', department_id: IDS.DA, name: 'QA AR E val', description: 'QA', is_active: true, execute_on: ['create'], ...b }); if (r.j?.data?.id) { await api('DELETE', '/desk/assignment-rules/' + r.j.data.id); return 'ACCEPTED ' + r.s; } return r.s + ' ' + (E(r) || '').slice(0, 160); };
const noMethod = await v({ targets: [{ criteria: SW('QA AR E'), pool: { kind: 'agents', user_ids: [IDS.A1], team_id: null, excluded_user_ids: [] } }] });
const badMethod = await v({ targets: [{ criteria: SW('QA AR E'), method: 'random', pool: { kind: 'agents', user_ids: [IDS.A1], team_id: null, excluded_user_ids: [] } }] });
const noPool = await v({ targets: [{ criteria: SW('QA AR E'), method: 'sequential', pool: { kind: 'agents', user_ids: [], team_id: null, excluded_user_ids: [] } }] });
const outsider = await v({ targets: [{ criteria: SW('QA AR E'), method: 'sequential', pool: { kind: 'agents', user_ids: [IDS.AG], team_id: null, excluded_user_ids: [] } }] });
const noDept = await v({ department_id: null, targets: [{ criteria: SW('QA AR E'), method: 'sequential', pool: { kind: 'agents', user_ids: [IDS.A1], team_id: null, excluded_user_ids: [] } }] });
L.push(R_('E-02', /^4/.test(noMethod) && /^4/.test(badMethod) ? 'Pass' : 'Fail', 'No method → ' + noMethod + '; unknown method → ' + badMethod));
L.push(R_('E-04', /^4/.test(noPool) && /^4/.test(outsider) && /^4/.test(noDept) ? 'Pass' : 'Fail', 'Empty pool → ' + noPool + '; agent not in department → ' + outsider + '; no department → ' + noDept));
return L;
