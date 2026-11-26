// Corrected EN / LS checks (own blueprint id, real request shapes). Note: a teammate's active "test blueprint" in Tech catches any subject containing "QA".
const g = 'EF' + uid(); const bp = await mkBp(BASIC(g));
const inOurs = async (t, id = bp.id) => { const s = await bstate(t); return s && s.blueprintDefinitionId === id ? s : null; };
const binFind = async needle => arr((await api('GET', '/audit/recycle-bin/items?limit=100')).j?.data).find(x => JS(x).includes(needle));
const restoreBin = async item => api('POST', '/audit/recycle-bin/restore', { ids: [item.id] });
// EN-11
{ const a = await mkT('NOPE' + uid(), 'no prefix'), b = await mkT(g, 'tech', { department: TECH }); await sleep(9000); const sb = await bstate(b);
  R('EN-11', !(await bstate(a)) && !(await inOurs(b)) ? 'PASS' : 'FAIL', `ticket not matching criteria entered ${!!(await bstate(a))}; matching ticket in Tech entered our blueprint ${!!(await inOurs(b))} (it entered "${sb?.blueprintName || 'none'}", a teammate's Tech blueprint that catches every "QA" subject)`); }
// EN-14 + LS-07 order
{ const g2 = 'ORD' + uid(); const b1 = await mkBp({ ...BASIC(g2), name: 'QA BP R ' + g2 + ' first' }); const b2 = await mkBp({ ...BASIC(g2), name: 'QA BP R ' + g2 + ' second' });
  const list = (await listBps()).filter(x => (x.department_id || x.definition?.departmentId) === DEPT).sort((a, b) => a.sortOrder - b.sortOrder);
  const ids = list.map(x => x.id); const firstId = ids.find(x => x === b1.id || x === b2.id);
  const t1 = await mkT(g2, 'one'); const s1 = await waitIn(t1);
  const sw = [...ids]; const i1 = sw.indexOf(b1.id), i2 = sw.indexOf(b2.id); [sw[i1], sw[i2]] = [sw[i2], sw[i1]];
  const so = await api('PATCH', `/modules/${T}/blueprints/sort`, { department_id: DEPT, items: sw.map((id, i) => ({ id, sort_order: (i + 1) * 10 })) });
  const t2 = await mkT(g2, 'two'); const s2 = await waitIn(t2);
  R('EN-14', s1?.blueprintDefinitionId === firstId && s2?.blueprintDefinitionId !== firstId && ok(so) ? 'PASS' : 'FAIL', `ticket 1 entered "${s1?.blueprintName}" (first in order); swapped order → ${E(so)}; ticket 2 entered "${s2?.blueprintName}"`);
  R('LS-07', ok(so) ? 'PASS' : 'FAIL', `reorder by API → ${E(so)} (drag + keyboard in Phase 3)`);
  await putBp(b1.id, null, false); await putBp(b2.id, null, false); }
// EN-20 complete
{ const t = await mkT(g, 'complete'); await waitIn(t); await runT(t, 'go'); await sleep(1500); await runT(t, 'end', 'Escalated'); await sleep(2500);
  const s = await bstate(t); const h = await histTxt(t); const p = await setF(t, { status: 'Open' });
  R('EN-20', (!s || s.isTerminal) && /completed/.test(h) && ok(p) ? 'PASS' : 'FAIL', `reached Closed: blueprint-state ${s ? 'kept with isTerminal=' + s.isTerminal + ' at ' + st(s) : 'empty'}; history "completed" ${/completed/.test(h)}; status editable again → ${E(p)}`); }
// EN-21 merge
{ const m1 = await mkT(g, 'merge master'), m2 = await mkT(g, 'merge child'); await waitIn(m1); await waitIn(m2); await runT(m2, 'go'); await sleep(1500);
  const mg = await api('POST', '/desk/tickets/merge', { master_ticket_id: m1, source_ticket_ids: [m2] }); await sleep(4000);
  const sm = await bstate(m1), sc = await bstate(m2); const c2 = await deskT(m2);
  R('EN-21', ok(mg) ? 'PASS' : 'FAIL', `merge a ticket in Escalated into a ticket in Open → ${E(mg)}; master stays ${st(sm)}; merged ticket: state ${st(sc)}, merged flag ${JS(c2?.merged_into || c2?.is_merged || c2?.status).slice(0, 60)}`); }
// EN-22 move department (NDC-2782): leaves OUR blueprint, status back to Open
{ const mv = await mkT(g, 'move'); await waitIn(mv); await runT(mv, 'go'); await sleep(1500);
  const r = await api('POST', `/desk/tickets/${mv}/move`, { department_id: TECH }); await sleep(4000);
  const ours = await inOurs(mv), any = await bstate(mv), status = await statusOf(mv);
  both('EN-22', 'NDC-2782', ok(r) && !ours && status === 'Open', `move ticket in Escalated to Tech → ${E(r)}; still in our blueprint ${!!ours}; status now ${status}${any ? ` (then entered "${any.blueprintName}", a Tech blueprint whose criteria match)` : ''}`); }
// EN-23 spam / delete / restore
{ const sp = await mkT(g, 'spam'); await waitIn(sp); const s1 = await api('POST', `/desk/tickets/${sp}/spam`, {}); await sleep(2000); const afterSpam = st(await bstate(sp));
  await api('DELETE', `/desk/tickets/${sp}/spam`); await sleep(1500);
  const del = await api('DELETE', `/modules/${T}/records/${sp}`); await sleep(2500);
  const item = await binFind(sp); const rs = item ? await restoreBin(item) : { s: 0, t: 'not in bin' }; await sleep(4000);
  R('EN-23', ok(s1) && ok(del) && ok(rs) ? 'PASS' : 'FAIL', `spam → ${E(s1)} (blueprint state while spam: ${afterSpam}); delete → ${E(del)}; restore → ${E(rs)}; blueprint state after restore: ${st(await bstate(sp))}`); }
// LS-10 / LS-11 include with skip reasons
{ const g3 = 'LSI' + uid(); const b3 = await mkBp(BASIC(g3));
  const free = await mkT('FREE' + uid(), 'free'), other = await mkT('FREE' + uid(), 'tech', { department: TECH }), inBp = await mkT(g, 'in other bp'); await waitIn(inBp);
  const inc = await api('POST', `/desk/blueprints/${b3.id}/include`, { state_id: 'Escalated', ticket_ids: [free, other, inBp, crypto.randomUUID()] }); await sleep(3500);
  const fs1 = await inOurs(free, b3.id); const h = await histTxt(free);
  R('LS-10', ok(inc) && st(fs1) === 'Escalated' && /owner|actor|included/i.test(h) ? 'PASS' : 'FAIL', `include at Escalated → ${E(inc)}; free ticket now ${st(fs1)}; history line ${/included|entered/.test(h)}`);
  R('LS-11', /DEPARTMENT_MISMATCH/.test(JS(inc.j)) && /IN_BLUEPRINT|NOT_FOUND/.test(JS(inc.j)) ? 'PASS' : 'FAIL', 'result: ' + JS(inc.j?.data || inc.j).slice(0, 400)); }
// LS-08 / RS-10 delete empty → bin → restore
{ const g4 = 'LSD' + uid(); const b4 = await mkBp(BASIC(g4)); const d = await api('DELETE', `/modules/${T}/blueprints/${b4.id}`); MADE.bps = MADE.bps.filter(x => x !== b4.id); keep(); await sleep(2000);
  const item = await binFind('QA BP R ' + g4); const rs = item ? await restoreBin(item) : { s: 0 }; await sleep(3000); const back = await getBp(b4.id); if (back) { MADE.bps.push(b4.id); keep(); }
  R('LS-08', ok(d) && !!item && ok(rs) && !!back ? 'PASS' : 'FAIL', `delete empty → ${E(d)}; in Recycle Bin ${!!item}; restore → ${E(rs)}; back (active ${back?.isActive})`);
  R('RS-10', ok(rs) && !!back ? 'PASS' : 'FAIL', `Recycle Bin restore of a blueprint → ${E(rs)}; purge checked at cleanup`); }
R('EN-09', 'INCONCLUSIVE', 'Desk "Clone" opens a pre-filled New Ticket form (no clone API) — checked on screen in Phase 3');
return await cleanup();
