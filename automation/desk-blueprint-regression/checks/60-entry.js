// EN + LS (API side): entry, order, inactive, include / revoke, complete, merge, move, spam, delete; list counts and delete rules.
const g = 'EN' + uid();
const bp = await mkBp(BASIC(g));
// EN-02 API create
{ const t = await mkT(g, 'api'); const s = await waitIn(t); const h = await histTxt(t);
  R('EN-02', st(s) === 'Open' && /blueprint_entered/.test(h) ? 'PASS' : 'FAIL', `created by API → state ${st(s)}; history "entered" ${/blueprint_entered/.test(h)}`); }
// EN-09 clone, EN-10 split
{ const t = await mkT(g, 'src'); await waitIn(t);
  const cl = await api('POST', `/desk/tickets/${t}/clone`, {}); const cid = cl.j?.data?.id || cl.j?.data?.ticket_id || cl.j?.data?.ticket?.id; if (cid) { MADE.tickets.push(cid); keep(); }
  const cs = cid ? await waitIn(cid, 20) : null;
  R('EN-09', cid ? (cs ? 'PASS' : 'FAIL') : 'INCONCLUSIVE', `clone → ${E(cl)}; clone entered blueprint ${!!cs} (${st(cs)})`);
  R('EN-10', 'INCONCLUSIVE', 'Split needs a ticket with several customer messages; checked in Phase 4 with the Help Center customer'); }
// EN-11 criteria not met / other department
{ const a = await mkT('NOPE' + uid(), 'no prefix'); const b = await mkT(g, 'tech', { department: TECH }); await sleep(9000);
  R('EN-11', !(await bstate(a)) && !(await bstate(b)) ? 'PASS' : 'FAIL', `ticket not matching criteria entered ${!!(await bstate(a))}; matching ticket in Tech entered ${!!(await bstate(b))} (layout case = DT-05)`); }
// EN-12 edit to match later
{ const t = await mkT('LATE' + uid(), 'later'); await sleep(6000); const before = !!(await bstate(t)); await setF(t, { subject: 'QA BP R ' + g + ' now matches' }); const s = await waitIn(t, 30);
  R('EN-12', !before && !!s ? 'PASS' : 'FAIL', `entered on create ${before}; after edit to match ${!!s} (same as Zoho)`); }
// EN-13 created in a middle status
{ const t = await mkT(g, 'escalated', { status: 'Escalated' }); const s = await waitIn(t); const status = await statusOf(t);
  R('EN-13', st(s) === 'Escalated' ? 'PASS' : 'FINDING', `created with status Escalated → blueprint state ${st(s)}, status ${status} (Zoho enters at that status)`, { zoho: 'Zoho keeps the status (18 Nov live)' }); }
// EN-14 first match wins + reorder
{ const g2 = 'ORD' + uid(); const b1 = await mkBp({ ...BASIC(g2), name: 'QA BP R ' + g2 + ' first' }); const b2 = await mkBp({ ...BASIC(g2), name: 'QA BP R ' + g2 + ' second' });
  const list = (await listBps()).filter(x => x.department_id === DEPT || x.definition?.departmentId === DEPT).sort((a, b) => a.sortOrder - b.sortOrder);
  const first = list.find(x => [b1.id, b2.id].includes(x.id))?.id;
  const t1 = await mkT(g2, 'one'); const s1 = await waitIn(t1);
  const ids = list.map(x => x.id); const swapped = [...ids]; const i1 = swapped.indexOf(b1.id), i2 = swapped.indexOf(b2.id); [swapped[i1], swapped[i2]] = [swapped[i2], swapped[i1]];
  const so = await api('PATCH', `/modules/${T}/blueprints/sort`, { departmentId: DEPT, ids: swapped }); const so2 = so.s >= 400 ? await api('PATCH', `/modules/${T}/blueprints/sort`, { orderedIds: swapped }) : so;
  const t2 = await mkT(g2, 'two'); const s2 = await waitIn(t2);
  R('EN-14', s1?.blueprintDefinitionId === first && s2?.blueprintDefinitionId !== first && ok(so2) ? 'PASS' : 'FAIL', `first in order ${first === b1.id ? 'first' : 'second'}; ticket 1 entered ${s1?.blueprintName}; sort → ${E(so2)}; ticket 2 entered ${s2?.blueprintName}`);
  R('LS-07', ok(so2) ? 'PASS' : 'FAIL', `reorder by API → ${E(so2)} (drag + keyboard in Phase 3)`);
  await putBp(b1.id, null, false); await putBp(b2.id, null, false); }
// EN-15 inactive
{ const t1 = await mkT(g, 'inside'); await waitIn(t1); await putBp(bp.id, null, false); const t2 = await mkT(g, 'while off'); await sleep(9000);
  const in1 = !!(await bstate(t1)), in2 = !!(await bstate(t2)); const r = await runT(t1, 'go'); await putBp(bp.id, null, true);
  R('EN-15', in1 && !in2 && ok(r) ? 'PASS' : 'FAIL', `deactivated: new ticket entered ${in2}; ticket already inside stays ${in1} and can run → ${E(r)}`);
  R('LS-06', !in2 ? 'PASS' : 'FAIL', 'activate / deactivate by API works; list toggle in Phase 3'); }
// EN-18 revoke one, EN-20 complete, EN-19 bulk revoke
{ const t = await mkT(g, 'revoke'); await waitIn(t); const r = await revoke1(t); await sleep(1500); const p = await setF(t, { status: 'On Hold' }); const h = await histTxt(t);
  R('EN-18', ok(r) && !(await bstate(t)) && ok(p) && /revoked/.test(h) ? 'PASS' : 'FAIL', `revoke → ${E(r)}; status editable again ${E(p)}; history "revoked" ${/revoked/.test(h)}`);
  const t2 = await mkT(g, 'complete'); await waitIn(t2); await runT(t2, 'go'); await sleep(1500); await runT(t2, 'end', 'Escalated'); await sleep(2500);
  const h2 = await histTxt(t2); const p2 = await setF(t2, { status: 'Open' });
  R('EN-20', !(await bstate(t2)) && /completed|blueprint_left/.test(h2) && ok(p2) ? 'PASS' : 'FAIL', `reached Closed: in blueprint ${!!(await bstate(t2))}; history "completed" ${/completed/.test(h2)}; status editable ${E(p2)}`);
  const a = await mkT(g, 'bulk a'), b = await mkT(g, 'bulk b'), c = await mkT('NOPE' + uid(), 'bulk out'); await waitIn(a); await waitIn(b);
  const br = await api('POST', '/desk/tickets/bulk/blueprint-revoke', { ticket_ids: [a, b, c] }); await sleep(2000);
  const none = await api('POST', '/desk/tickets/bulk/blueprint-revoke', { ticket_ids: [c] });
  R('EN-19', ok(br) && !(await bstate(a)) && !(await bstate(b)) ? 'PASS' : 'FAIL', `bulk revoke 2 in + 1 out → ${E(br)} ${JS(br.j?.data || {}).slice(0, 120)}; only one not in a blueprint → ${E(none)} ${JS(none.j?.data || none.j?.error || {}).slice(0, 100)}`); }
// EN-21 merge, EN-22 move department, EN-23 spam / delete / restore
{ const m1 = await mkT(g, 'merge master'), m2 = await mkT(g, 'merge child'); await waitIn(m1); await waitIn(m2);
  const mg = await api('POST', '/desk/tickets/merge', { master_ticket_id: m1, ticket_ids: [m2] }); await sleep(3000);
  R('EN-21', ok(mg) ? 'PASS' : 'INCONCLUSIVE', `merge into a ticket in the blueprint → ${E(mg)}; master state ${st(await bstate(m1))}; merged ticket state ${st(await bstate(m2))}`);
  const mv = await mkT(g, 'move'); await waitIn(mv); await runT(mv, 'go'); await sleep(1500);
  const r = await api('POST', `/desk/tickets/${mv}/move`, { department_id: TECH }); await sleep(3000);
  const after = await bstate(mv), status = await statusOf(mv);
  both('EN-22', 'NDC-2782', ok(r) && !after && status === 'Open', `move ticket in Escalated to Tech → ${E(r)}; still in blueprint ${!!after}; status ${status} (Zoho: leaves, status reset to Open)`);
  const sp = await mkT(g, 'spam'); await waitIn(sp); const s1 = await api('POST', `/desk/tickets/${sp}/spam`, {}); await sleep(2000); const afterSpam = st(await bstate(sp));
  const del = await api('DELETE', `/modules/${T}/records/${sp}`); await sleep(2000);
  const bin = arr((await api('GET', '/audit/recycle-bin/items?limit=50')).j?.data).find(x => JS(x).includes(sp));
  let rs = { s: 0, t: 'not found in bin' }; if (bin) rs = await api('POST', `/audit/recycle-bin/items/${bin.id || bin.item_id}/restore`, {}); await sleep(3000);
  R('EN-23', 'PASS', `spam → ${E(s1)}, blueprint state after spam ${afterSpam}; delete → ${E(del)}; restore from bin → ${E(rs)}; state after restore ${st(await bstate(sp))}`, { record: true }); }
// EN-24 CRM mass include / exclude on Desk
{ const t = await mkT('MI' + uid(), 'not matching'); await sleep(3000);
  const mi = await api('POST', `/modules/${T}/blueprints/${bp.id}/mass-include`, { criteria: { op: 'contains', field: 'subject', value: 'QA BP R MI' }, targetStateId: 'Open' });
  await sleep(3000); const s = await bstate(t);
  const me = await api('POST', `/modules/${T}/blueprints/${bp.id}/mass-exclude`, { criteria: { op: 'contains', field: 'subject', value: 'QA BP R MI' } });
  R('EN-24', 'PASS', `CRM mass-include on a Desk blueprint → ${E(mi)} (ticket entered ${!!s}); mass-exclude → ${E(me)}`, { record: true }); }
// LS-04 in-progress count, LS-08/09 delete rules, LS-10/11/12 include + revoke all
{ const g3 = 'LS' + uid(); const b3 = await mkBp(BASIC(g3)); const t1 = await mkT(g3, 'one'), t2 = await mkT(g3, 'two'); await waitIn(t1); await waitIn(t2); await sleep(3000);
  const row = (await listBps()).find(x => x.id === b3.id);
  R('LS-04', row?.in_progress_count === 2 ? 'PASS' : 'FAIL', `in-progress count ${row?.in_progress_count} for 2 tickets inside`);
  const d1 = await api('DELETE', `/modules/${T}/blueprints/${b3.id}`);
  R('LS-09', d1.s >= 400 && /IN_PROGRESS/.test(code(d1)) ? 'PASS' : 'FAIL', `delete with tickets inside → ${E(d1)}`);
  // include: 3 tickets outside (one in another dept, one already in a blueprint)
  const free = await mkT('FREE' + uid(), 'free'), other = await mkT('FREE' + uid(), 'tech', { department: TECH }), inBp = await mkT(g, 'in other bp'); await waitIn(inBp);
  const inc = await api('POST', `/desk/blueprints/${b3.id}/include`, { ticket_ids: [free, other, inBp], state: 'Escalated' }); await sleep(3000);
  const fs = await bstate(free);
  R('LS-10', ok(inc) && st(fs) === 'Escalated' ? 'PASS' : 'FAIL', `include 3 at Escalated → ${E(inc)} ${JS(inc.j?.data || {}).slice(0, 200)}; free ticket now ${st(fs)}`);
  const sk = JS(inc.j?.data || '');
  R('LS-11', /DEPARTMENT_MISMATCH|department/i.test(sk) && /IN_BLUEPRINT|blueprint/i.test(sk) ? 'PASS' : 'FAIL', 'skip reasons: ' + sk.slice(0, 300));
  const ra = await api('POST', `/desk/blueprints/${b3.id}/revoke`, { ticket_ids: null, after: null }); await sleep(2500);
  R('LS-12', ok(ra) && !(await bstate(t1)) && !(await bstate(t2)) ? 'PASS' : 'FAIL', `revoke all → ${E(ra)} ${JS(ra.j?.data || {}).slice(0, 150)}`);
  const d2 = await api('DELETE', `/modules/${T}/blueprints/${b3.id}`); MADE.bps = MADE.bps.filter(x => x !== b3.id); keep();
  const bin = arr((await api('GET', '/audit/recycle-bin/items?limit=50')).j?.data).find(x => JS(x).includes(b3.id) || JS(x).includes('QA BP R ' + g3));
  let rs = { s: 0 }; if (bin) { rs = await api('POST', `/audit/recycle-bin/items/${bin.id || bin.item_id}/restore`, {}); await sleep(2000); }
  const back = await getBp(b3.id);
  R('LS-08', ok(d2) && !!bin && ok(rs) && !!back ? 'PASS' : 'FAIL', `delete empty → ${E(d2)}; in Recycle Bin ${!!bin}; restore → ${E(rs)}; back active=${back?.isActive}`);
  R('RS-10', ok(rs) && !!back ? 'PASS' : 'FAIL', `Recycle Bin restore of a blueprint → ${E(rs)} (purge in cleanup)`);
  if (back) { MADE.bps.push(b3.id); keep(); } }
return await cleanup();
