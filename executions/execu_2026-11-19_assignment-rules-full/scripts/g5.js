const L = []; const ledIds = () => fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => / ticket "QA AR /.test(l)).map(l => l.match(/[0-9a-f-]{36}/)[0]);
const ownedOpen = async who => { const r = []; for (const id of ledIds().reverse()) { const t = await getT(id); if (t.department === IDS.DB && t.status !== 'Closed' && nmU(t.owner && (t.owner.id || t.owner)) === who) { r.push(id); if (r.length >= 2) break; } } return r; };
const full = async (extra) => prefsS(IDS.DB, { agent_threshold_enabled: true, agent_thresholds: [{ user_id: IDS.A1, threshold: Math.max(1, await wlo(IDS.A1, IDS.DB)) }, { user_id: IDS.A2, threshold: Math.max(1, await wlo(IDS.A2, IDS.DB)) }], assign_backlogs: false, assign_on_closure: true, incoming_mode: 'immediate', ...(extra || {}) });
// (d) offline agent, offline agents ON, admin closes its ticket
await full({ assign_to_offline_agents: true }); L.push({ off: await setP({ a2: 'off' }) });
await mk('Z3', 'QA AR FB Z3 offline-close'); await sleep(8000); let mine = await ownedOpen('A2');
await patchT(mine[0], { status: 'Closed' }); let s = await watchK(['TK_Z3'], 75);
L.push(R_('F-08d', s.TK_Z3 ? 'Pass' : 'Fail', 'NDC-3137 recheck: A2 offline (email channel off), "Assign tickets to offline agents" ON, admin closes A2\'s ticket: backlog Z3 → ' + (s.TK_Z3 || 'still unassigned after 75 s')));
L.push({ on: await setP({ a2: 'on' }) }); await sleep(15000); const z3 = await ownN(IDS.TK_Z3);
// (e) closing a ticket with no owner
await full({ assign_to_offline_agents: false }); const nom = await patchT(IDS.TK_NOM, { status: 'Closed' }); await sleep(30000); const z3b = await ownN(IDS.TK_Z3);
L.push(R_('F-08e', !z3b ? 'Pass' : 'Fail', 'Closing an unowned ticket (' + nom.s + ') with backlog Z3 waiting: Z3 owner after 30 s ' + z3b + ' (expected nothing: no agent freed a slot). Z3 after A2 came back online (closure only): ' + z3));
// F-10 incoming mode: push into backlog first
await full({ incoming_mode: 'backlog_first', agent_thresholds: [{ user_id: IDS.A1, threshold: 60 }, { user_id: IDS.A2, threshold: 60 }], assign_on_closure: false });
await mk('N1', 'QA AR FB N1 backlog-first'); await sleep(15000); const n1 = { owner: await ownN(IDS.TK_N1), bl: await bl(IDS.TK_N1) };
await prefsS(IDS.DB, { assign_backlogs: true }); s = await watchK(['TK_N1', 'TK_Z3'], 100);
L.push(R_('F-10a', !n1.owner && n1.bl && s.TK_N1 ? 'Pass' : 'Fail', 'Incoming = "Push into backlog first", agents have room: new N1 after 15 s owner ' + n1.owner + ', in_backlog ' + n1.bl + '; after Assign backlogs on → ' + JSON.stringify(s)));
await prefsS(IDS.DB, { assign_backlogs: false, assign_on_closure: true }); await mk('N2', 'QA AR FB N2 backlog-first closure'); await sleep(15000); const n2 = await ownN(IDS.TK_N2);
mine = await ownedOpen('A1'); await closeAs('a1', mine[0]); s = await watchK(['TK_N2'], 60);
L.push(R_('F-10b', !n2 && s.TK_N2 ? 'Pass' : 'Fail', 'Backlog first + only closure on: N2 waited (owner ' + n2 + '); after A1 closed a ticket → ' + JSON.stringify(s)));
await prefsS(IDS.DB, { incoming_mode: 'immediate' }); return L;
