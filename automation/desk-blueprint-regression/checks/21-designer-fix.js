// Follow-ups for DT-05, DT-07, ST-05, ST-06, ST-07, ST-13 (test fixes after 20-designer).
const tag = 'DF' + uid();
const stored = async id => (await getBp(id))?.definition || {};
// layout create: find which body key sets created_with_layout_id
const lays = L((await api('GET', `/modules/${T}/layouts`)).j?.data);
const mkTL = async (tg, suffix, layoutId) => {
  for (const extra of [{ layoutId }, { layout_id: layoutId }]) {
    const data = { subject: 'QA BP R ' + tg + ' ' + suffix, status: 'Open', department: DEPT };
    const r = await api('POST', `/modules/${T}/records`, { ...extra, data: Object.entries(data).map(([f, v]) => ({ field: f, value: enc(v) })) });
    const id = r.j?.data?.id; if (id) { MADE.tickets.push(id); keep(); const got = (await rec(id))?.created_with_layout_id; if (got === layoutId) return id; }
  }
  return null;
};
const [L1, L2] = lays;
const lt = 'LY' + uid();
const lb = await mkBp({ ...BASIC(lt), layoutId: L1.id }, true);
const ta = await mkTL(lt, 'L1', L1.id), tb = await mkTL(lt, 'L2', L2.id);
if (ta && tb) { await sleep(9000); const ia = !!(await bstate(ta)), ib = !!(await bstate(tb)); R('DT-05', ia && !ib ? 'PASS' : 'FAIL', `blueprint for layout "${L1.name}": ticket on it entered ${ia}; ticket on "${L2.name}" entered ${ib}`); }
else R('DT-05', 'INCONCLUSIVE', 'could not create tickets on a chosen layout through the API (created_with_layout_id ignored) — check in Phase 3 with New Ticket on two layouts');
await putBp(lb.id, null, false);
// DT-07: AND group with the real priority value
const ct = 'CR' + uid();
const variants = { andChildren: { op: 'and', children: [crit(ct), { op: 'eq', field: 'priority', value: 'high' }] } };
const cg = await mkBp({ ...BASIC(ct), entryCriteria: variants.andChildren }, true);
if (cg.ok) {
  const th = await mkT(ct, 'high', { priority: 'high' }), tl = await mkT(ct, 'low', { priority: 'low' });
  await sleep(9000); const eh = !!(await bstate(th)), el = !!(await bstate(tl));
  R('DT-07', eh && !el ? 'PASS' : 'FAIL', `entry criteria AND (subject + Priority = high): high ticket entered ${eh}; low ticket entered ${el}; stored ${JSON.stringify((await stored(cg.id)).entryCriteria).slice(0, 160)}`);
  await putBp(cg.id, null, false);
} else R('DT-07', 'FINDING', 'AND group refused by the API: ' + E(cg.r));
// ST-05 per-state business hours set
const bh = (await api('GET', '/desk/business-hours')).j?.data; const prof = (bh.profiles || [])[0];
const sv = async x => { const m = await mkBp(DEF(tag, [ST('Open', x), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]), false); return m.ok ? (await stored(m.id)).states[0] : 'refused ' + code(m.r); };
const chosen = prof ? await sv({ slaMinutes: 120, slaClock: 'business', slaBusinessHoursId: prof.id }) : 'no profile';
const gone = await sv({ slaMinutes: 120, slaClock: 'business', slaBusinessHoursId: crypto.randomUUID() });
R('ST-05', chosen?.slaBusinessHoursId === prof?.id ? (typeof gone === 'object' ? 'FINDING' : 'PASS') : 'FAIL', `profiles ${(bh.profiles || []).length}; chosen set stored ${chosen?.slaBusinessHoursId === prof?.id}; unknown set id: ${typeof gone === 'object' ? 'SAVED (designer shows "Deleted business hours, default counts")' : gone}`);
// ST-06 warning + run-out actions stored
const s6 = await sv({ slaMinutes: 120, slaPreExpiryMinutes: 60, slaPreExpiryEscalation: [{ kind: 'notify', title: 'QA warn', body: 'w', notifyOwner: true }], slaEscalation: [{ kind: 'notify', title: 'QA due', body: 'd', notifyOwner: true }, { kind: 'setField', field: 'priority', value: 'high' }] });
R('ST-06', (s6.slaPreExpiryEscalation || []).length === 1 && (s6.slaEscalation || []).length === 2 ? 'PASS' : 'FAIL', `stored warning actions ${(s6.slaPreExpiryEscalation || []).length}, run-out actions ${(s6.slaEscalation || []).length}`);
// ST-07 verdict: only the unknown template id was accepted
R('ST-07', 'FINDING', '3 levels (before/at/after) saved; offset 0, before ≥ limit, > 365 days, no recipients, no limit and 12 levels all refused; a level whose template id does not exist is SAVED (designer shows "This email template was deleted"). Runtime effect checked in TM-04');
// ST-13 transition order = order of transitions in the definition?
const o1 = await mkBp(DEF('OR' + tag, S3(), [TR('b', 'Open', 'Closed'), TR('a', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]), true);
const tt = await mkT('OR' + tag); await waitIn(tt);
const first = await transIds(tt);
await putBp(o1.id, d => { d.transitions = [d.transitions[1], d.transitions[0], d.transitions[2]]; return d; });
await sleep(1500); const second = await transIds(tt);
R('ST-13', first.join() === 'b,a' && second.join() === 'a,b' ? 'PASS' : 'FAIL', `order follows the definition's transition list: before [${first}], after reorder [${second}] (designer reorder control in Phase 3)`);
await putBp(o1.id, null, false);
return await cleanup();
