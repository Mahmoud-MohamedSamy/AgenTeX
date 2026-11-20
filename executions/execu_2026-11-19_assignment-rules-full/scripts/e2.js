const L = []; const run = async (pfx, n, gap) => { const o = []; for (let i = 1; i <= n; i++) { const t = await mkTicket(pfx + ' ' + i, IDS.DA); await sleep(gap || 3500); o.push({ id: t.id, o: (await waitO(t.id, 20)).owner }); } return o; };
const off = async id => setActive(id, false);
// E-09 sequential
let r = await mkRR('QA AR E09 seq', IDS.DA, SW('QA AR E09'), 'sequential', [IDS.A1, IDS.A2, IDS.A3]); IDS.RR_E09 = r.id;
let o = await run('QA AR E09', 6); const seq = o.map(x => x.o); const cyc = seq.slice(3).join() === seq.slice(0, 3).join() && new Set(seq.slice(0, 3)).size === 3;
L.push(R_('E-09', cyc ? 'Pass' : 'Fail', 'Sequential pool A1,A2,A3 (offline agents on), 6 tickets → ' + seq.join(', ')));
// E-12 / E-19 offline skipped + history
await prefsS(IDS.DA, { assign_to_offline_agents: false }); o = await run('QA AR E09 skip', 3); const sk = [];
for (const x of o) { const h = (await hist(x.id)).find(y => /auto_assigned/.test(y)) || ''; sk.push(x.o + (/skipped_user_ids\":\[\"5491656d/.test(h) ? ' (A3 SKIPPED)' : '')); }
L.push(R_('E-12', o.every(x => x.o !== 'A3') && sk.some(x => /SKIPPED/.test(x)) ? 'Pass' : 'Fail', 'Offline agents off, A3 offline: 3 tickets → ' + sk.join(', ')));
const h0 = (await hist(o[0].id)).find(y => /auto_assigned/.test(y)) || ''; L.push(R_('E-19', /rule_name/.test(h0) && /strategy/.test(h0) && /owner_id/.test(h0) ? 'Pass' : 'Fail', 'History entry: ' + h0.slice(0, 400)));
// E-11 pool change mid-sequence
await prefsS(IDS.DA, { assign_to_offline_agents: true }); const g = await getRule(r.id); const pt = await putRule(r.id, { targets: g.targets.map(t => ({ ...t, pool: { ...t.pool, user_ids: [IDS.A1, IDS.A3] } })) });
o = await run('QA AR E09 pool', 3); L.push(R_('E-11', o[0].o === 'A1' ? 'Pass' : 'Fail', 'After removing A2 from the pool (' + pt.s + '): next 3 → ' + o.map(x => x.o).join(', ') + ' (requirement RR-6: restart at the first agent, A1)'));
await off(r.id);
// E-10 team pool sequential (alphabetical) and E-05 excluded
r = await mkRule({ type: 'round_robin', department_id: IDS.DA, name: 'QA AR E10 team', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: SW('QA AR E10'), method: 'sequential', pool: { kind: 'team', user_ids: [], team_id: IDS.TA, excluded_user_ids: [] } }] }); IDS.RR_E10 = r.id;
o = await run('QA AR E10', 4); L.push(R_('E-10', o.every(x => x.o === 'A2' || x.o === 'A3') && o[0].o !== o[1].o ? 'Pass' : 'Fail', 'Team pool QA AS6 Team A (A2 Mahmoud Samy, A3 Dev Team 2): ' + o.map(x => x.o).join(', ') + ' (Zoho: team members in alphabetical order → Dev Team 2 first)'));
const g2 = await getRule(r.id); await putRule(r.id, { targets: g2.targets.map(t => ({ ...t, pool: { ...t.pool, excluded_user_ids: [IDS.A3] } })) });
o = await run('QA AR E10 excl', 3); L.push(R_('E-05', o.every(x => x.o === 'A2') ? 'Pass' : 'Fail', 'Team pool with A3 excluded: ' + o.map(x => x.o).join(', ')));
await off(r.id); saveIds(); return L;
