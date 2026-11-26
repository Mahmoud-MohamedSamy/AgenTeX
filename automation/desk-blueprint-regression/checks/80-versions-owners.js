// VR — drafts, publish, versions, conflicts, audit; DO — per-ticket owners; ST-06 redo.
const since = new Date().toISOString();
const g = 'VR' + uid(); const b = await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Open', 'On Hold'), TR('end', 'Escalated', 'Closed')]));
const t0 = await mkT(g, 'before'); await waitIn(t0);
// VR-01 draft
const g1 = await getBp(b.id); const d1 = JSON.parse(JSON.stringify(g1.definition)); d1.transitions = d1.transitions.filter(x => x.id !== 'hold'); d1.description = 'QA draft';
const sd = await api('PUT', `/modules/${T}/blueprints/${b.id}/draft`, { definition: d1, revision: g1.revision });
const g2 = await getBp(b.id); const live = await transIds(t0);
R('VR-01', ok(sd) && g2.hasDraft && live.includes('hold') ? 'PASS' : 'FAIL', `save draft → ${E(sd)}; hasDraft ${g2.hasDraft} (v${g2.draftVersion}); ticket inside still offered [${live}] (live version unchanged)`);
// VR-02 publish
const pb = await api('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: g2.revision }); await sleep(2000);
const g3 = await getBp(b.id); const t1 = await mkT(g, 'after publish'); await waitIn(t1);
R('VR-02', ok(pb) && !g3.hasDraft && !(await transIds(t1)).includes('hold') ? 'PASS' : 'FAIL', `publish → ${E(pb)}; hasDraft ${g3.hasDraft}; new ticket offered [${await transIds(t1)}]; old ticket offered [${await transIds(t0)}]`);
// VR-11 removed transition a ticket was about to run
const old = await runT(t0, 'hold');
R('VR-11', old.s >= 400 ? 'PASS' : 'FAIL', `run "hold" (removed in the new version) on a ticket that entered before → ${E(old)}`);
// VR-03 versions + restore
const vs = L((await api('GET', `/modules/${T}/blueprints/${b.id}/versions`)).j?.data);
const v1 = vs.map(v => v.version ?? v.versionNumber).filter(Boolean).sort((a, x) => a - x)[0];
const one = await api('GET', `/modules/${T}/blueprints/${b.id}/versions/${v1}`);
const rs = await api('POST', `/modules/${T}/blueprints/${b.id}/versions/${v1}/restore`, {}); const g4 = await getBp(b.id);
R('VR-03', vs.length >= 2 && ok(one) && ok(rs) && g4.hasDraft ? 'PASS' : 'FAIL', `versions ${vs.length} [${vs.map(v => (v.version ?? v.versionNumber) + ':' + (v.status || v.kind || '')).join(', ')}]; view v${v1} → ${one.s}; restore → ${E(rs)}; restored as working draft ${g4.hasDraft}`);
await api('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: (await getBp(b.id)).revision }); await sleep(1500);
// VR-04 double publish
const g5 = await getBp(b.id); await api('PUT', `/modules/${T}/blueprints/${b.id}/draft`, { definition: { ...g5.definition, description: 'QA double' }, revision: g5.revision });
const g6 = await getBp(b.id); const vBefore = L((await api('GET', `/modules/${T}/blueprints/${b.id}/versions`)).j?.data).length;
const [p1, p2] = await Promise.all([api('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: g6.revision }), api('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: g6.revision })]);
await sleep(1500); const vAfter = L((await api('GET', `/modules/${T}/blueprints/${b.id}/versions`)).j?.data).length;
R('VR-04', [p1, p2].filter(ok).length === 1 && vAfter - vBefore <= 1 ? 'PASS' : 'FAIL', `two publishes at once → ${p1.s}/${p2.s}; versions ${vBefore} → ${vAfter}`);
// VR-05 two writers, VR-06 no revision
const g7 = await getBp(b.id);
const w1 = await api('PUT', `/modules/${T}/blueprints/${b.id}`, { definition: { ...g7.definition, description: 'QA writer 1' }, isActive: true, revision: g7.revision });
const w2 = await B('PUT', `/modules/${T}/blueprints/${b.id}`, { definition: { ...g7.definition, description: 'QA writer 2' }, isActive: true, revision: g7.revision });
const nr = await api('PUT', `/modules/${T}/blueprints/${b.id}`, { definition: { ...g7.definition, description: 'QA no revision' }, isActive: true });
const g8 = await getBp(b.id);
both('VR-05', 'NDC-3030', ok(w1) && w2.s === 409, `writer 1 → ${E(w1)}; writer 2 with the same base → ${E(w2)}; final description "${g8.definition.description}"`);
both('VR-06', 'NDC-3070', nr.s >= 400 && g8.definition.description !== 'QA no revision', `save without revision → ${E(nr)}`);
// VR-10 partial body + read-only keys
const pr = await api('PUT', `/modules/${T}/blueprints/${b.id}`, { definition: { name: 'QA BP R ' + g + ' partial' }, isActive: true, revision: g8.revision });
const ro = await api('PUT', `/modules/${T}/blueprints/${b.id}`, { id: crypto.randomUUID(), in_progress_count: 999, createdAt: '2000-01-01T00:00:00Z', definition: g8.definition, isActive: true, revision: (await getBp(b.id)).revision });
const g9 = await getBp(b.id);
R('VR-10', pr.s >= 400 && g9.id === b.id && g9.createdAt !== '2000-01-01T00:00:00Z' && (g9.definition.states || []).length === 4 ? 'PASS' : 'FAIL', `PUT with only a name → ${E(pr)}; read-only keys → ${E(ro)}; id kept ${g9.id === b.id}; states kept ${(g9.definition.states || []).length}`);
// VR-12 rename / remove an empty state / change limit in a new version
const t2 = await mkT(g, 'limit'); await waitIn(t2);
const g10 = await getBp(b.id); const d10 = JSON.parse(JSON.stringify(g10.definition)); d10.states = d10.states.map(s => s.id === 'Open' ? { ...s, slaMinutes: 600 } : s); d10.states.find(s => s.id === 'Escalated').name = 'QA Escalated renamed';
const up = await api('PUT', `/modules/${T}/blueprints/${b.id}`, { definition: d10, isActive: true, revision: g10.revision }); await sleep(1500);
const t3 = await mkT(g, 'new limit'); const s3 = await waitIn(t3); const s2 = await bstate(t2);
R('VR-12', ok(up) && s3?.escalation_due_at && !s2?.escalation_due_at ? 'PASS' : (ok(up) ? 'FINDING' : 'FAIL'), `new version with a 10 h limit on Open and a renamed state → ${E(up)}; ticket that entered before: due ${s2?.escalation_due_at || 'none'}; new ticket: due ${s3?.escalation_due_at || 'none'}; status of old ticket ${await statusOf(t2)}`);
// VR-13 audit
await sleep(5000);
const ev = arr((await api('GET', `/audit/events?limit=100&from=${encodeURIComponent(since)}`)).j?.data).filter(e => JS(e).includes(b.id) || JS(e).includes('QA BP R ' + g));
const actions = [...new Set(ev.map(e => e.action || e.event_type || e.type))];
const ips = [...new Set(ev.map(e => e.ip_address || e.ip || e.client_ip).filter(Boolean))];
R('VR-13', actions.length >= 3 && !ips.some(ip => /172\.|::ffff:10\.|127\.0\.0\.1/.test(ip)) ? 'PASS' : 'FAIL', `audit events for this blueprint: ${ev.length} [${actions.join(', ')}]; IPs ${ips.join(', ') || 'none'}`);
RG('NDC-3029', actions.length >= 3 ? 'PASS' : 'FAIL', 'audit actions ' + actions.join(', '));
RG('NDC-3067', ips.length && !ips.some(ip => /172\.|::ffff:/.test(ip)) ? 'PASS' : (ips.length ? 'FAIL' : 'INCONCLUSIVE'), 'audit IPs ' + (ips.join(', ') || 'none recorded'));
// DO — per-ticket owners
const gd = 'DO' + uid(); await mkBp(DEF(gd, S3(), [TR('go', 'Open', 'Escalated', { before: { allowedUserIds: [U.A] } }), TR('end', 'Escalated', 'Closed')], { dynamicOwners: true }));
const td = await mkT(gd); await waitIn(td);
const setO = await api('PUT', `/modules/${T}/records/${td}/blueprint/owners/go`, { userIds: [U.B], teamIds: [] }); await sleep(1500);
const sA = (await transIds(td, A)).join(','), sB = (await transIds(td, B)).join(','); const h1 = await histTxt(td);
R('DO-01', ok(setO) && sB === 'go' && sA === '' && /owners_set/.test(h1) ? 'PASS' : 'FAIL', `set owners of "go" on this ticket to B → ${E(setO)}; A sees [${sA}], B sees [${sB}]; history "owners set" ${/owners_set/.test(h1)}`);
const setD = await api('PUT', `/modules/${T}/records/${td}/blueprint/owners/go`, { userIds: [], teamIds: [], departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [U.C], teamIds: [] }] }); await sleep(2000);
const empty = await api('PUT', `/modules/${T}/records/${td}/blueprint/owners/go`, { userIds: [], teamIds: [], departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [], teamIds: [] }] });
R('DO-02', ok(setD) && (await transIds(td, C)).includes('go') && empty.s >= 400 ? 'PASS' : 'FAIL', `owner from Tech (Full) → ${E(setD)}, Tech agent sees ${(await transIds(td, C)).join(',') || '-'}; department with nobody → ${E(empty)}`);
const clr = await api('DELETE', `/modules/${T}/records/${td}/blueprint/owners/go`); const clr2 = clr.s >= 400 ? await api('PUT', `/modules/${T}/records/${td}/blueprint/owners/go`, { reset: true }) : clr; await sleep(1500);
R('DO-03', ok(clr2) && (await transIds(td, A)).includes('go') && /owners_reset/.test(await histTxt(td)) ? 'PASS' : 'FAIL', `clear → ${E(clr)} / ${E(clr2)}; A (blueprint owner) sees again ${(await transIds(td, A)).join(',') || '-'}; history "reset" ${/owners_reset/.test(await histTxt(td))}`);
const byAgent = await api('PUT', `/modules/${T}/records/${td}/blueprint/owners/go`, { userIds: [U.A], teamIds: [] }, {}); const byA = await A('PUT', `/modules/${T}/records/${td}/blueprint/owners/go`, { userIds: [U.A], teamIds: [] });
const gn = 'DON' + uid(); await mkBp(BASIC(gn)); const tn = await mkT(gn); await waitIn(tn); const off = await api('PUT', `/modules/${T}/records/${tn}/blueprint/owners/go`, { userIds: [U.B], teamIds: [] });
R('DO-04', byA.s >= 400 && off.s >= 400 ? 'PASS' : 'FAIL', `Desk Agent sets owners → ${E(byA)}; admin on a blueprint with dynamic owners off → ${E(off)}`);
// ST-06 redo with real action kinds
const s6 = await mkBp(DEF('ST6' + uid(), [ST('Open', { slaMinutes: 120, slaPreExpiryMinutes: 60, slaPreExpiryEscalation: [aNotify('QA warn', { owner: true })], slaEscalation: [aNotify('QA due', { owner: true }), aSet('priority', 'high')] }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]), false);
const st6 = s6.ok ? (await getBp(s6.id)).definition.states[0] : {};
R('ST-06', (st6.slaPreExpiryEscalation || []).length === 1 && (st6.slaEscalation || []).length === 2 ? 'PASS' : 'FAIL', `stored warning actions ${(st6.slaPreExpiryEscalation || []).length}, run-out actions ${(st6.slaEscalation || []).length} (${E(s6.r)})`);
return await cleanup();
