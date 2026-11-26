// VR rerun with a valid draft (remove "hold" + the On Hold state), audit after publish/restore/delete, DO-03 clear.
const since = new Date().toISOString();
const g = 'VR' + uid(); const b = await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Open', 'On Hold'), TR('back', 'On Hold', 'Open'), TR('end', 'Escalated', 'Closed')]));
const t0 = await mkT(g, 'before'); await waitIn(t0);
const g1 = await getBp(b.id); const d1 = JSON.parse(JSON.stringify(g1.definition));
d1.transitions = d1.transitions.filter(x => !['hold', 'back'].includes(x.id)); d1.states = d1.states.filter(s => s.id !== 'On Hold'); d1.description = 'QA draft';
const sd = await api('PUT', `/modules/${T}/blueprints/${b.id}/draft`, { definition: d1, revision: g1.revision });
const g2 = await getBp(b.id);
const pb = await api('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: g2.revision }); await sleep(2000);
const g3 = await getBp(b.id); const t1 = await mkT(g, 'after publish'); await waitIn(t1);
R('VR-02', ok(sd) && ok(pb) && !g3.hasDraft && !(await transIds(t1)).includes('hold') ? 'PASS' : 'FAIL', `draft → ${E(sd)}; publish → ${E(pb)}; hasDraft after ${g3.hasDraft}; new ticket offered [${await transIds(t1)}]; ticket that entered before offered [${await transIds(t0)}]`);
const old = await runT(t0, 'hold'); await sleep(1500);
R('VR-11', old.s >= 400 ? 'PASS' : 'FINDING', `run "hold" (removed in the published version) on a ticket that entered before → ${E(old)}; ticket now ${st(await bstate(t0))}`);
const vs = L((await api('GET', `/modules/${T}/blueprints/${b.id}/versions`)).j?.data);
const nums = vs.map(v => v.version ?? v.versionNumber ?? v.number).filter(x => x != null).sort((a, x) => a - x);
const one = await api('GET', `/modules/${T}/blueprints/${b.id}/versions/${nums[0]}`);
const rs = await api('POST', `/modules/${T}/blueprints/${b.id}/versions/${nums[0]}/restore`, {}); const g4 = await getBp(b.id);
R('VR-03', vs.length >= 2 && ok(one) && ok(rs) && g4.hasDraft ? 'PASS' : 'FAIL', `versions ${vs.length} (${JS(vs.map(v => ({ v: v.version ?? v.versionNumber, s: v.status || v.state || v.kind }))).slice(0, 160)}); view first → ${one.s}; restore → ${E(rs)}; restored as working draft ${g4.hasDraft}`);
const pb2 = await api('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: g4.revision }); await sleep(1500);
// VR-04 double publish
const g5 = await getBp(b.id); await api('PUT', `/modules/${T}/blueprints/${b.id}/draft`, { definition: { ...g5.definition, description: 'QA double' }, revision: g5.revision });
const g6 = await getBp(b.id); const vB = L((await api('GET', `/modules/${T}/blueprints/${b.id}/versions`)).j?.data).length;
const [p1, p2] = await Promise.all([api('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: g6.revision }), api('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: g6.revision })]);
await sleep(1500); const vA = L((await api('GET', `/modules/${T}/blueprints/${b.id}/versions`)).j?.data).length;
R('VR-04', [p1, p2].filter(ok).length === 1 && vA - vB <= 1 ? 'PASS' : 'FAIL', `two publishes at once → ${p1.s}/${p2.s}; versions ${vB} → ${vA}`);
// VR-05 two writers
const g7 = await getBp(b.id);
const w1 = await api('PUT', `/modules/${T}/blueprints/${b.id}`, { definition: { ...g7.definition, description: 'QA writer 1' }, isActive: true, revision: g7.revision });
const w2 = await B('PUT', `/modules/${T}/blueprints/${b.id}`, { definition: { ...g7.definition, description: 'QA writer 2' }, isActive: true, revision: g7.revision });
const g8 = await getBp(b.id);
both('VR-05', 'NDC-3030', ok(w1) && w2.s === 409, `writer 1 → ${E(w1)}; writer 2 with the same base revision → ${E(w2)}; saved description "${g8.definition.description}"`);
// VR-12 limit change in a new version
const t2 = await mkT(g, 'limit'); await waitIn(t2);
const d10 = JSON.parse(JSON.stringify(g8.definition)); d10.states = d10.states.map(s => s.id === 'Open' ? { ...s, slaMinutes: 600 } : s.id === 'Escalated' ? { ...s, name: 'QA Escalated renamed' } : s);
const up = await api('PUT', `/modules/${T}/blueprints/${b.id}`, { definition: d10, isActive: true, revision: g8.revision }); await sleep(1500);
const t3 = await mkT(g, 'new limit'); const s3 = await waitIn(t3); const s2 = await bstate(t2);
R('VR-12', ok(up) && !!s3?.escalation_due_at ? 'PASS' : 'FAIL', `new version: 10 h limit on Open + renamed Escalated → ${E(up)}; ticket that entered before: due ${s2?.escalation_due_at || 'none (keeps old rules)'}; new ticket due ${s3?.escalation_due_at || 'none'}; status of old ticket ${await statusOf(t2)}`);
// VR-13 audit after publish / restore / delete
await revoke1(t0); await revoke1(t1); await revoke1(t2); await revoke1(t3); await sleep(1500);
const dl = await api('DELETE', `/modules/${T}/blueprints/${b.id}`); MADE.bps = MADE.bps.filter(x => x !== b.id); keep(); await sleep(6000);
const ev = arr((await api('GET', `/audit/events?limit=200&from=${encodeURIComponent(since)}`)).j?.data).filter(e => JS(e).includes(b.id));
const kinds = ev.map(e => [e.action, e.event_type, e.type, e.summary, e.description].filter(Boolean).join(':'));
const acts = [...new Set(ev.map(e => e.action))];
const ips = [...new Set(ev.map(e => e.ip_address || e.ip || e.client_ip || e.source_ip).filter(Boolean))];
R('VR-13', acts.some(a => /created/.test(a)) && acts.some(a => /updated/.test(a)) && acts.some(a => /deleted|removed/.test(a)) ? 'PASS' : 'FAIL', `audit events ${ev.length}, actions [${acts.join(', ')}] after create, draft, publish ×3, restore, update, delete (delete → ${dl.s}); publish/restore shown as: ${JS(kinds.filter(k => /publish|restor|version/i.test(k))).slice(0, 160) || 'no distinct entry'}; IPs ${ips.join(', ') || 'none in the event data'}`);
RG('NDC-3029', acts.length >= 2 ? 'PASS' : 'FAIL', 'audit actions ' + acts.join(', '));
RG('NDC-3067', ips.length ? (ips.some(ip => /^(172\.|10\.|::ffff:172|::ffff:10)/.test(ip)) ? 'FAIL' : 'PASS') : 'INCONCLUSIVE', 'audit IPs ' + (ips.join(', ') || 'not in API data — screen check in Phase 3'));
// DO-03 clear owners (all empty)
const gd = 'DO3' + uid(); await mkBp(DEF(gd, S3(), [TR('go', 'Open', 'Escalated', { before: { allowedUserIds: [U.A] } }), TR('end', 'Escalated', 'Closed')], { dynamicOwners: true }));
const td = await mkT(gd); await waitIn(td);
await api('PUT', `/modules/${T}/records/${td}/blueprint/owners/go`, { userIds: [U.B], teamIds: [] }); await sleep(1500);
const clr = await api('PUT', `/modules/${T}/records/${td}/blueprint/owners/go`, { userIds: [], teamIds: [], departmentOwners: [] }); await sleep(1500);
R('DO-03', ok(clr) && (await transIds(td, A)).includes('go') && /owners_reset/.test(await histTxt(td)) ? 'PASS' : 'FAIL', `clear (all empty) → ${E(clr)}; A (blueprint owner) sees again ${(await transIds(td, A)).join(',') || '-'}; history "owners reset" ${/owners_reset/.test(await histTxt(td))}`);
return await cleanup();
