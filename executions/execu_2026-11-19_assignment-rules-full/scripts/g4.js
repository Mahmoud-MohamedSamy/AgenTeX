const L = []; const ledIds = () => fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => / ticket "QA AR /.test(l)).map(l => l.match(/[0-9a-f-]{36}/)[0]);
const ownedOpen = async who => { const r = []; for (const id of ledIds()) { const t = await getT(id); if (t.department === IDS.DB && t.status !== 'Closed' && nmU(t.owner && (t.owner.id || t.owner)) === who) r.push(id); } return r; };
const full = async () => prefsS(IDS.DB, { agent_threshold_enabled: true, agent_thresholds: [{ user_id: IDS.A1, threshold: Math.max(1, await wlo(IDS.A1, IDS.DB)) }, { user_id: IDS.A2, threshold: Math.max(1, await wlo(IDS.A2, IDS.DB)) }], assign_backlogs: false, assign_on_closure: true });
// make sure each agent has spare QA AR tickets to close: give each 6 more while there is room
await prefsS(IDS.DB, { agent_thresholds: [{ user_id: IDS.A1, threshold: 30 }, { user_id: IDS.A2, threshold: 30 }], assign_backlogs: false, assign_on_closure: false });
for (let i = 1; i <= 12; i++) { await mkTicket('QA AR FB pool ' + i, IDS.DB); await sleep(2500); }
await sleep(5000); L.push(await full()); L.push({ wl: [await wlo(IDS.A1, IDS.DB), await wlo(IDS.A2, IDS.DB)] });
// (a) agent closes own ticket
await mk('Z1', 'QA AR FB Z1 close-own'); await sleep(8000); let mine = await ownedOpen('A1');
let c = await closeAs('a1', mine[0]); let s = await watchK(['TK_Z1'], 60);
L.push(R_('F-08a', s.TK_Z1 && s.TK_Z1.startsWith('A1') ? 'Pass' : 'Fail', 'Closure on, backlogs off, A1 online and full; A1 closes own ticket (' + c.slice(0, 40) + '): backlog Z1 → ' + JSON.stringify(s)));
// (b) admin closes A2's ticket, A2 online
await full(); await mk('Z2', 'QA AR FB Z2 admin-close'); await sleep(8000); mine = await ownedOpen('A2');
await patchT(mine[0], { status: 'Closed' }); s = await watchK(['TK_Z2'], 60);
L.push(R_('F-08b', s.TK_Z2 && s.TK_Z2.startsWith('A2') ? 'Pass' : 'Fail', 'Administrator closes A2\'s ticket, A2 online: backlog Z2 → ' + JSON.stringify(s)));
// (c) 5 repetitions, agent closes own ticket
const reps = []; for (let i = 1; i <= 5; i++) { await full(); await mk('ZR' + i, 'QA AR FB ZR' + i + ' repeat'); await sleep(7000); mine = await ownedOpen('A1'); await closeAs('a1', mine[0]); const r = await watchK(['TK_ZR' + i], 60); reps.push(r['TK_ZR' + i] || 'NOT ASSIGNED'); }
L.push(R_('F-08c', reps.every(x => x.startsWith('A1')) ? 'Pass' : 'Fail', '5 repetitions (A1 closes own ticket with a backlog ticket waiting): ' + reps.join(', ')));
saveIds(); return L;
