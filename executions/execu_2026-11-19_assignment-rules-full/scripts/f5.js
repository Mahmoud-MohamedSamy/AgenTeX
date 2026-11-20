const L = [];
// A1 full, A2 at threshold = current workload (open + on hold); backlogs off so nothing drains
const a1 = await wlo(IDS.A1, IDS.DA), a2 = await wlo(IDS.A2, IDS.DA);
L.push(await prefsS(IDS.DA, { department_threshold_enabled: true, department_threshold: 1, agent_threshold_enabled: true, agent_thresholds: [{ user_id: IDS.A1, threshold: a1 }, { user_id: IDS.A2, threshold: a2 }], assign_backlogs: false, assign_on_closure: false }));
let t = await mkTicket('QA AR F15 before hold', IDS.DA); let o = await waitO(t.id, 25); IDS.TK_F15a = t.id; L.push({ a1, a2, beforeHold: o.owner });
// put one of A2's QA AR tickets On Hold
const led = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => /QA AR F01/.test(l)).map(l => l.match(/[0-9a-f-]{36}/)[0]);
let held = null; for (const id of led) { if ((await ownN(id)) === 'A2') { held = id; break; } }
const p = sh(await patchT(held, { status: 'On Hold' })); await sleep(5000); IDS.TK_HELD = held; saveIds();
L.push({ held: held && held.slice(0, 8), patch: p.s, a2After: await wlo(IDS.A2, IDS.DA) });
t = await mkTicket('QA AR F15 after hold', IDS.DA); o = await waitO(t.id, 25); IDS.TK_F15b = t.id; saveIds();
L.push(R_('F-15', o.owner === 'A2' ? 'Fail' : 'Pass', 'A2 threshold = A2 open+on hold (' + a2 + '), A1 full. Before: new ticket owner ' + L[1].beforeHold + '. After moving one of A2\'s tickets Open → On Hold (workload still ' + L[2].a2After + '): new ticket owner ' + o.owner + '. Requirement: threshold counts open AND on hold, so A2 should stay full' + (o.owner === 'A2' ? ' — FAIL: On Hold tickets are not counted, A2 went over threshold' : '')));
await patchT(held, { status: 'Open' });
return L;
