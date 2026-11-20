const L = []; const iso = d => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10); const bl = async k => (await api('GET', '/desk/tickets/' + IDS[k])).j.data.in_backlog;
const watch = async (keys, sec) => { const seen = {}; const t0 = Date.now(); while (Date.now() - t0 < sec * 1000) { for (const k of keys) if (!seen[k]) { const o = await ownN(IDS[k]); if (o) seen[k] = o + '@' + Math.round((Date.now() - t0) / 1000) + 's'; } if (keys.every(k => seen[k])) break; await sleep(5000); } return seen; };
L.push(await prefsS(IDS.DB, { assign_to_offline_agents: false, department_threshold_enabled: false, agent_threshold_enabled: true, agent_thresholds: [{ user_id: IDS.A1, threshold: 7 }, { user_id: IDS.A2, threshold: 1 }], assign_backlogs: false, assign_on_closure: false, backlog_order: 'due_date', backlog_limit: 10, incoming_mode: 'immediate' }));
for (const k of ['FILL1', 'FILL2']) { const t = await mkTicket('QA AR FB ' + k, IDS.DB); IDS['TK_' + k] = t.id; await sleep(3000); }
await sleep(6000); L.push({ fill: [await ownN(IDS.TK_FILL1), await ownN(IDS.TK_FILL2)] });
const due = { X1: 3, X2: 1, X3: 2 }; for (const k of ['X1', 'X2', 'X3']) { const t = await mkTicket('QA AR FB ' + k + ' due+' + due[k], IDS.DB, { due_date: iso(due[k]) }); IDS['TK_' + k] = t.id; await sleep(1500); }
saveIds(); await sleep(6000); L.push({ backlog: [await bl('TK_X1'), await bl('TK_X2'), await bl('TK_X3')] });
// F-07b order due date, one free slot for A2
L.push(await prefsS(IDS.DB, { agent_thresholds: [{ user_id: IDS.A1, threshold: 7 }, { user_id: IDS.A2, threshold: 2 }], assign_backlogs: true }));
let s = await watch(['TK_X1', 'TK_X2', 'TK_X3'], 100);
L.push(R_('F-07b', s.TK_X2 && !s.TK_X1 && !s.TK_X3 ? 'Pass' : 'Fail', 'Order Due Date, one free slot (A2): assigned ' + JSON.stringify(s) + ' — expected X2 (due soonest) only'));
// F-07c freed by closing a ticket (admin closes A1 fill ticket)
const a1fill = (await ownN(IDS.TK_FILL1)) === 'A1' ? 'TK_FILL1' : 'TK_FILL2'; await patchT(IDS[a1fill], { status: 'Closed' });
s = await watch(['TK_X1', 'TK_X3'], 100);
L.push(R_('F-07c', s.TK_X3 && !s.TK_X1 ? 'Pass' : 'Fail', 'Assign backlogs + slot freed by closing an A1 ticket: assigned ' + JSON.stringify(s) + ' — expected X3 (next due) to A1'));
// F-07d agent comes online
L.push({ off: await setP({ a2: 'off' }) }); L.push(await prefsS(IDS.DB, { agent_thresholds: [{ user_id: IDS.A1, threshold: 7 }, { user_id: IDS.A2, threshold: 3 }] }));
s = await watch(['TK_X1'], 75); const whileOff = s.TK_X1 || 'none';
L.push({ on: await setP({ a2: 'on' }) }); const s2 = await watch(['TK_X1'], 100);
L.push(R_('F-07d', whileOff === 'none' && s2.TK_X1 && s2.TK_X1.startsWith('A2') ? 'Pass' : 'Fail', 'A2 offline with a free slot (offline agents off): X1 in 75 s → ' + whileOff + '; after A2 came online → ' + JSON.stringify(s2)));
saveIds(); return L;
