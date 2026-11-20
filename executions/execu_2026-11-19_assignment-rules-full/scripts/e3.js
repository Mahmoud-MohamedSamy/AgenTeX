const L = [R_('E-12', 'Pass', 'Offline agents off, A3 offline: 3 tickets → A1, A2, A1; third ticket history skipped_user_ids = [A3] (A3\'s turn skipped)')];
const run = async (pfx, n, dept) => { const o = []; for (let i = 1; i <= n; i++) { const t = await mkTicket(pfx + ' ' + i, dept || IDS.DA); await sleep(3500); o.push({ id: t.id, o: (await waitO(t.id, 20)).owner }); } return o; };
await prefsS(IDS.DA, { assign_to_offline_agents: true });
// E-13 load based
const w = { A1: await wlo(IDS.A1, IDS.DA), A2: await wlo(IDS.A2, IDS.DA), A3: await wlo(IDS.A3, IDS.DA) };
let r = await mkRR('QA AR E13 load', IDS.DA, SW('QA AR E13'), 'load', [IDS.A1, IDS.A2, IDS.A3]); IDS.RR_E13 = r.id;
let o = await run('QA AR E13', 3); const low = Object.entries(w).sort((a, b) => a[1] - b[1])[0][0];
L.push(R_('E-13', o.every(x => x.o === low) ? 'Pass' : 'Fail', 'Load based, Dept A open counts ' + JSON.stringify(w) + ': 3 tickets → ' + o.map(x => x.o).join(', ') + ' (expected the least loaded, ' + low + ')'));
await setActive(r.id, false);
// E-15 two rules match -> first in list
const r1 = await mkRR('QA AR E15 first A1', IDS.DA, SW('QA AR E15'), 'sequential', [IDS.A1]); const r2 = await mkRR('QA AR E15 second A2', IDS.DA, SW('QA AR E15'), 'sequential', [IDS.A2]); IDS.RR_E15a = r1.id; IDS.RR_E15b = r2.id;
o = await run('QA AR E15', 2); const h = (await hist(o[0].id)).filter(y => /auto_assigned/.test(y)).length;
L.push(R_('E-15', o.every(x => x.o === 'A1') && h === 1 ? 'Pass' : 'Fail', 'Two matching RR rules (first → A1, second → A2): tickets → ' + o.map(x => x.o).join(', ') + '; assignment entries in history: ' + h));
// E-17 RR master switch off
const ns = (await api('GET', '/desk/assignment/notification-settings')).j.data; const p1 = sh(await api('PUT', '/desk/assignment/notification-settings', { ...ns, round_robin_rules_enabled: false })); LED('RR master switch OFF (restore ON)');
o = await run('QA AR E15 master', 1); await sleep(10000); const mo = await ownN(o[0].id); const mb = await bl(o[0].id);
const p2 = sh(await api('PUT', '/desk/assignment/notification-settings', { ...ns, round_robin_rules_enabled: true })); LED('RR master switch restored ON');
L.push(R_('E-17', !mo && !mb && p1.s === 200 && p2.s === 200 ? 'Pass' : 'Fail', 'Round Robin master switch off (' + p1.s + '): matching ticket owner ' + mo + ', in_backlog ' + mb + ' after 25 s; switch restored (' + p2.s + ')'));
await setActive(r1.id, false); await setActive(r2.id, false);
// E-20 RR rule executed on update
r = await mkRule({ type: 'round_robin', department_id: IDS.DA, name: 'QA AR E20 update', description: 'QA', is_active: true, execute_on: ['update'], targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA AR E20 GO' }], pattern: '1' }, method: 'sequential', pool: { kind: 'agents', user_ids: [IDS.A2], team_id: null, excluded_user_ids: [] } }] }); IDS.RR_E20 = r.id;
const t = await mkTicket('QA AR E20 start', IDS.DA); await sleep(8000); const before = await ownN(t.id);
await patchT(t.id, { subject: 'QA AR E20 GO now' }); const af = await waitO(t.id, 30);
L.push(R_('E-20', !before && af.owner === 'A2' ? 'Pass' : 'Fail', 'RR rule "on update" (subject contains QA AR E20 GO): created ticket owner ' + before + '; after subject edit → ' + af.owner + ' in ' + af.s + ' s'));
await setActive(r.id, false);
// E-21 moved into department: which rule assigned Y3?
const yh = (await hist(IDS.TK_Y3)).filter(y => /auto_assigned/.test(y)).map(y => y.slice(0, 250));
L.push(R_('E-21', 'Info', 'Ticket moved Dept B → Dept A was assigned by Dept A round-robin: ' + JSON.stringify(yh)));
saveIds(); return L;
