const L = []; const wA = async k => wlo(IDS[k], IDS.DA); const dtk = async id => (await api('GET', '/desk/tickets/' + id)).j.data;
// F-03 department threshold reached -> backlog
L.push(await prefsS(IDS.DA, { department_threshold_enabled: true, department_threshold: 1, agent_threshold_enabled: false, agent_thresholds: [] }));
let t = await mkTicket('QA AR F03 dept full', IDS.DA); let o = await waitO(t.id, 25); let d = await dtk(t.id); IDS.TK_F03 = t.id;
L.push(R_('F-03', !o.owner && d.in_backlog ? 'Pass' : 'Fail', 'Department threshold 1 (every agent has more than 1 open): ticket owner ' + o.owner + ', in_backlog ' + d.in_backlog + '. History: ' + JSON.stringify(await hist(t.id)).slice(0, 250)));
// F-05 agent threshold overrides department threshold
const a1 = await wA('A1'); L.push(await prefsS(IDS.DA, { agent_threshold_enabled: true, agent_thresholds: [{ user_id: IDS.A1, threshold: a1 + 1 }] }));
t = await mkTicket('QA AR F05 agent override', IDS.DA); o = await waitO(t.id, 25);
L.push(R_('F-05', o.owner === 'A1' ? 'Pass' : 'Fail', 'Dept threshold 1 + A1 agent threshold ' + (a1 + 1) + ' (A1 had ' + a1 + '): new ticket owner ' + o.owner + ' (expected A1; A2 limited by dept threshold 1)'));
// F-06 agent switch off keeps rows, falls back to department threshold
L.push(await prefsS(IDS.DA, { agent_threshold_enabled: false })); const p = await prefsG(IDS.DA);
t = await mkTicket('QA AR F06 agent off', IDS.DA); o = await waitO(t.id, 25); d = await dtk(t.id);
L.push(R_('F-06', p.agent_thresholds.length === 1 && !o.owner && d.in_backlog ? 'Pass' : 'Fail', 'Agent level switched off: rows kept = ' + JSON.stringify(p.agent_thresholds.map(x => nmU(x.user_id) + ':' + x.threshold)) + '; new ticket owner ' + o.owner + ', in_backlog ' + d.in_backlog + ' (dept threshold 1 applies again)'));
// F-09 both backlog options off -> backlog stays
L.push(await prefsS(IDS.DA, { assign_backlogs: false, assign_on_closure: false, department_threshold: 200, agent_thresholds: [] }));
await sleep(80000); const left = []; for (const k of ['TK_F03']) left.push(await ownN(IDS[k]));
L.push(R_('F-09', left.every(x => !x) ? 'Pass' : 'Fail', 'Both backlog options off, threshold raised to 200 (room for everyone): backlog ticket F03 after 80 s owner ' + left.join(',') + ' (expected still unassigned)'));
saveIds(); return L;
