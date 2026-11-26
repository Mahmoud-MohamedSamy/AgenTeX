// Rechecks after batch 2.
// IN-08 status sync with time to settle
{ const g = 'SYN' + uid(); await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Escalated', 'On Hold'), TR('back', 'On Hold', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const res = []; for (let i = 0; i < 4; i++) { const t = await mkT(g, 's' + i); await waitIn(t); for (const [tid, from] of [['go', 'Open'], ['hold', 'Escalated'], ['back', 'On Hold']]) { await runT(t, tid, from); const r0 = await statusOf(t); let dk = (await deskT(t))?.status, w = 0; while (dk !== r0 && w < 30) { await sleep(2000); w += 2; dk = (await deskT(t))?.status; } res.push({ i, tid, rec: r0, desk: dk, secs: w }); } }
  const stuck = res.filter(x => x.rec !== x.desk), slow = res.filter(x => x.secs > 0);
  both('IN-08', 'NDC-3135', stuck.length === 0, `12 moves: Desk status equal to the record status within 30 s in ${12 - stuck.length}/12; lagged then caught up ${slow.length - stuck.length} (max ${Math.max(...res.map(x => x.secs))} s); stuck ${JS(stuck)}`); }
// CV-03 case-only duplicate status
{ const sts = (await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []; const dup = sts.filter(s => s.value.toLowerCase() === 'open');
  R('CV-03', dup.length > 1 ? 'FAIL' : 'PASS', `Add State "open" (lowercase) → 200; ticket statuses now named open/Open: ${JS(dup.map(s => s.value + ':' + s.type))}; "Open" → 409 "already a Status of type open". The designer says “Open” already exists as Open — the API makes a case-only duplicate`); }
// E2E-01 detail: A approves while B owns the ticket
{ const g = 'E1R' + uid(); await mkBp(DEF(g, [ST('Open'), ST('QA BP Verify'), ST('Escalated'), ST('QA BP Done', { isTerminal: true })], [TR('verify', 'Open', 'QA BP Verify'), TR('approve', 'QA BP Verify', 'Escalated', { before: { allowedUserIds: [U.A] }, during: { deskItems: [{ kind: 'resolution', mandatory: true }] } }), TR('pay', 'Escalated', 'QA BP Done')]));
  const t = await mkT(g); await waitIn(t); await api('POST', `/desk/tickets/${t}/assign`, { owner_id: U.B }); await runT(t, 'verify', 'Open', {}, B); await sleep(1500);
  const seeT = await A('GET', `/desk/tickets/${t}`); const seeTr = await transIds(t, A);
  const ap = await runT(t, 'approve', 'QA BP Verify', { resolution: { content: 'QA approved' } }, A);
  log('E2E-01 detail', JS({ aTicket: seeT.s, aSees: seeTr, approve: E(ap) }));
  const t2 = await mkT(g, 'unassigned'); await waitIn(t2); await runT(t2, 'verify'); await sleep(1500); const ap2 = await runT(t2, 'approve', 'QA BP Verify', { resolution: { content: 'QA approved' } }, A);
  R('E2E-01', 'FINDING', `refund flow: transition owner Agent A (Desk Agent) cannot run "Approve" on a ticket owned by B: A opens ticket → ${seeT.s}, A is offered [${seeTr}], A runs → ${E(ap)}; on an unassigned ticket A runs → ${E(ap2)}. Rest of the journey (B refused as non-owner, required items, completion) as in EN/TU/RN cases`); }
// E2E-04 messages
{ const g = 'E4R' + uid(); await mkBp({ ...BASIC(g), strictMode: { scope: 'allExcept', actions: ['reply'] } }); const t = await mkT(g); await waitIn(t);
  const cm = await A('POST', `/desk/tickets/${t}/comments`, { content_html: '<p>x</p>' }), rs = await A('PUT', `/desk/tickets/${t}/resolution`, { resolution: 'x' });
  const gc = 'E4C' + uid(); await mkBp(BASIC(gc)); const tc = await mkT(gc); await waitIn(tc); const cmc = await A('POST', `/desk/tickets/${tc}/comments`, { content_html: '<p>x</p>' }), rsc = await A('PUT', `/desk/tickets/${tc}/resolution`, { resolution: 'x' });
  R('E2E-04', cm.s === 403 && rs.s === 403 ? 'PASS' : (ok(cmc) && ok(rsc) ? 'FAIL' : 'INCONCLUSIVE'), `strict All Except [replies], Agent A by hand: comment → ${E(cm)}; resolution → ${E(rs)}; same on a non-strict ticket: ${cmc.s}/${rsc.s}; edit refused 403 and both steps ran (earlier run)`); }
// API-04 / API-06 record route payload
{ const g = 'API4' + uid(); await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Escalated', 'On Hold'), TR('end', 'On Hold', 'Closed')]));
  const t = await mkT(g); await waitIn(t);
  const r1 = await api('POST', `/modules/${T}/records/${t}/blueprint-transitions/go`, {}); await sleep(1500);
  const r2 = await runT(t, 'hold', 'Escalated'); await sleep(1500);
  const bh = await api('GET', `/modules/${T}/records/${t}/blueprint-history`); const items = L(bh.j?.data);
  R('API-04', ok(r1) && ok(r2) ? 'PASS' : 'FAIL', `record route with an empty body → ${E(r1)}; desk route → ${E(r2)}. Note: the record route refuses run_id / expected_state_id / fields ("Unknown field"), so retries and stale-form protection only exist on the Desk route`);
  R('API-06', ok(bh) && items.length >= 2 && items.every(i => i.fromStateId || i.toStateId) ? 'PASS' : 'FAIL', `blueprint-history ${bh.s}: ${items.length} entries ${JS(items.map(i => (i.fromStateId || '-') + '→' + (i.toStateId || '-') + ' ' + (i.transitionId || ''))).slice(0, 200)}`); }
// CV-16 big blueprint with a full chain first
{ const sts = ((await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []).map(s => s.value).filter(v => !/QA BP R |^open$/.test(v)).slice(0, 30);
  const trs = []; for (let i = 0; i < sts.length - 1; i++) trs.push(TR('n' + i, sts[i], sts[i + 1])); let k = 0;
  for (let i = 0; i < sts.length - 2 && trs.length < 80; i++) for (let j = i + 2; j < Math.min(sts.length, i + 5) && trs.length < 80; j++) trs.push(TR('x' + (k++), sts[i], sts[j]));
  const t0 = Date.now(); const m = await mkBp(DEF('BIG' + uid(), sts.map((v, i) => ST(v, i === sts.length - 1 ? { isTerminal: true } : {})), trs), false); const tc = Date.now() - t0;
  let tp = '-'; if (m.ok) { const g1 = await getBp(m.id); await api('PUT', `/modules/${T}/blueprints/${m.id}/draft`, { definition: { ...g1.definition, description: 'QA big' }, revision: g1.revision }); const t1 = Date.now(); const p = await api('POST', `/modules/${T}/blueprints/${m.id}/publish`, { revision: (await getBp(m.id)).revision }); tp = (Date.now() - t1) + ' ms (' + p.s + ')'; }
  R('CV-16', m.ok ? 'PASS' : 'FAIL', `${sts.length} states / ${trs.length} transitions → ${E(m.r)} in ${tc} ms (screen layout in Phase 3)`);
  R('PF-01', m.ok && tc < 5000 ? 'PASS' : 'FAIL', `API create ${tc} ms; publish ${tp}; designer open time in Phase 3`); }
// TM-13 no-filter branch (Okay is switched off in Customer Happiness, so use Good)
{ const strip = o => { const c = { ...o }; for (const k of ['expiry_days_min', 'expiry_days_max', 'question_max_length', 'public_page_configured', 'closed_email_subject_max', 'closed_email_body_max', 'resend_after_hours_max', 'supervisors_max', 'option_label_max', 'option_text_max', 'option_image_max_bytes']) delete c[k]; return c; };
  const H0 = (await api('GET', '/desk/happiness/settings')).j?.data;
  try { await api('PUT', '/desk/happiness/settings', { ...strip(H0), is_enabled: true, department_scope_enabled: true, department_ids: [DEPT] });
    const g = 'RTN' + uid(); await mkBp(DEF(g, [ST('Open', { onRatingTransitionId: 'esc' }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('esc', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
    const t = await mkT(g); await waitIn(t);
    const ln = await api('POST', `/desk/tickets/${t}/happiness-link`, {}); const url = ln.j?.data?.url || ln.j?.data?.link || ''; const tok = ln.j?.data?.token || (url.match(/happiness\/([^/?#]+)/) || [])[1];
    const p = tok ? await fetch('https://staging-desk.taviportal.com/api/v1/desk/public/happiness/' + encodeURIComponent(tok), { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'x-app-key': 'desk' }, body: JSON.stringify({ rating: 'good', feedback: 'QA', email: null }) }) : { status: 0 };
    await sleep(15000); const s = st(await bstate(t));
    R('TM-13', s === 'Escalated' ? 'PASS' : 'FAIL', `filter [Bad]: Bad → Escalated, Good → stays Open (batch 2); no filter: Good rating (${p.status}) → ${s}. "Okay" is switched off in this tenant's Customer Happiness, so the Okay value could not be sent`);
  } finally { const cur = (await api('GET', '/desk/happiness/settings')).j?.data; const b = await api('PUT', '/desk/happiness/settings', { ...strip(H0), row_version: cur?.row_version }); const now = (await api('GET', '/desk/happiness/settings')).j?.data; R('P4-RESTORE-HAPPINESS', now?.is_enabled === H0.is_enabled && JS(now?.department_ids) === JS(H0.department_ids) ? 'PASS' : 'FAIL', 'restored → ' + E(b) + ' enabled ' + now?.is_enabled, { extra: 'cleanup' }); } }
// TF-06 / TM-17 where do system mails show? history + replies of a ticket closed by blueprint
{ const g = 'MAIL' + uid(); await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { after: [aEmail({ contact: true, owner: true })] }), TR('end', 'Escalated', 'Closed')])); const t = await mkT(g); await waitIn(t); await api('POST', `/desk/tickets/${t}/assign`, { owner_id: U.A }); await runT(t, 'go'); await sleep(2000); await runT(t, 'end', 'Escalated'); await sleep(20000);
  const h = await hist(t); const mails = h.filter(x => /mail|email|notif/i.test(JS(x)));
  const rep = L((await api('GET', `/desk/tickets/${t}/replies`)).j?.data);
  log('mail evidence', JS({ histMail: mails.map(x => x.action), replies: rep.map(x => x.direction + ':' + (x.subject || '').slice(0, 40)), actions: [...new Set(h.map(x => x.action))] }).slice(0, 800)); }
return await cleanup();
