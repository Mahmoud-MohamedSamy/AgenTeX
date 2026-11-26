// Phase 4: Customer Happiness (QA dept only) → rating trigger, closed mail; business hours Mon–Fri + holiday → business clock; email action.
// Every shared setting is restored in finally and verified.
const strip = o => { const c = { ...o }; for (const k of ['expiry_days_min', 'expiry_days_max', 'question_max_length', 'public_page_configured', 'closed_email_subject_max', 'closed_email_body_max', 'resend_after_hours_max', 'supervisors_max', 'option_label_max', 'option_text_max', 'option_image_max_bytes']) delete c[k]; return c; };
const H0 = (await api('GET', '/desk/happiness/settings')).j?.data;
const BH0 = (await api('GET', '/desk/business-hours')).j?.data;
fs.writeFileSync(RUN + '/baseline/p4-happiness-orig.json', JSON.stringify(H0, null, 1)); fs.writeFileSync(RUN + '/baseline/p4-bh-orig.json', JSON.stringify(BH0, null, 1));
const pub = async (tok, method, body) => { const r = await fetch('https://staging-desk.taviportal.com/api/v1/desk/public/happiness/' + encodeURIComponent(tok), { method, headers: { 'content-type': 'application/json', accept: 'application/json', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'x-app-key': 'desk' }, body: body ? JSON.stringify(body) : undefined }); return { s: r.status, t: (await r.text()).slice(0, 300) }; };
const rate = async (t, rating) => { const ln = await api('POST', `/desk/tickets/${t}/happiness-link`, {}); const url = ln.j?.data?.url || ln.j?.data?.link || ''; const tok = ln.j?.data?.token || (url.match(/happiness\/([^/?#]+)/) || [])[1]; if (!tok) return { s: 0, t: 'no link ' + E(ln) }; return pub(tok, 'POST', { rating, feedback: 'QA BP R ' + rating, email: null }); };
try {
  // ---------- Customer Happiness ON for QA BP Reg Dept only
  const on = await api('PUT', '/desk/happiness/settings', { ...strip(H0), is_enabled: true, department_scope_enabled: true, department_ids: [DEPT] });
  log('happiness on', E(on));
  // TM-13 rating filters
  const g = 'RT' + uid();
  await mkBp(DEF(g, [ST('Open', { onRatingTransitionId: 'esc', onRatingValues: ['bad'] }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('esc', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const tb = await mkT(g, 'bad'), tg = await mkT(g, 'good'); await waitIn(tb); await waitIn(tg);
  const rb = await rate(tb, 'bad'), rg = await rate(tg, 'good'); await sleep(15000);
  const sb = st(await bstate(tb)), sg = st(await bstate(tg));
  const ga = 'RTA' + uid(); await mkBp(DEF(ga, [ST('Open', { onRatingTransitionId: 'esc' }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('esc', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const to = await mkT(ga, 'okay'); await waitIn(to); const ro = await rate(to, 'okay'); await sleep(15000); const so = st(await bstate(to));
  R('TM-13', sb === 'Escalated' && sg === 'Open' && so === 'Escalated' ? 'PASS' : 'FAIL', `filter [Bad]: Bad rating (${rb.s}) → ${sb}; Good rating (${rg.s}) → ${sg}; no filter: Okay rating (${ro.s}) → ${so}; history ${(await histTxt(tb)).match(/rat[a-z]*/i)?.[0] || ''}`);
  // TM-17 close through a transition: closed email + rating request (NDC-3054 / NDC-3053)
  const gc = 'CL' + uid(); await mkBp(BASIC(gc)); const tc = await mkT(gc); await waitIn(tc); await runT(tc, 'go'); await sleep(1500); const rc = await runT(tc, 'end', 'Escalated'); await sleep(15000);
  const out = L((await api('GET', `/desk/tickets/${tc}/replies`)).j?.data).filter(x => x.direction === 'outbound');
  const h = await histTxt(tc);
  const closedMail = out.find(x => /closed|rate|happy|feedback/i.test((x.subject || '') + (x.body_html || '')));
  both('TM-17', 'NDC-3054', ok(rc) && !!closedMail, `close through the blueprint → ${E(rc)}; outbound mails on the ticket ${out.length} [${out.map(x => (x.subject || '').slice(0, 50) + ':' + x.status).join(' | ')}]; ticket.closed in history ${/closed/.test(h)}`);
  RG('NDC-3053', closedMail ? 'PASS' : 'FAIL', 'closed mail with Customer Happiness on: ' + !!closedMail);
  // TF-06 email action to contact + owner + team
  const ge = 'EM' + uid(); await mkBp(DEF(ge, S3(), [TR('go', 'Open', 'Escalated', { after: [aEmail({ contact: true, owner: true, teamIds: [TEAM] })] }), TR('end', 'Escalated', 'Closed')]));
  const te = await mkT(ge); await waitIn(te); await api('POST', `/desk/tickets/${te}/assign`, { owner_id: U.A }); const re = await runT(te, 'go'); await sleep(20000);
  const oe = L((await api('GET', `/desk/tickets/${te}/replies`)).j?.data).filter(x => x.direction === 'outbound');
  R('TF-06', oe.some(x => /QA BP Reg/.test(x.subject || '')) ? 'PASS' : 'FAIL', `email after-action → run ${E(re)}; outbound on the ticket: ${oe.map(x => JS(x.to).slice(0, 60) + ' "' + (x.subject || '').slice(0, 50) + '" ' + x.status).join(' | ') || 'none'} (inbox delivery of +qae1 not opened)`);
} finally {
  const cur = (await api('GET', '/desk/happiness/settings')).j?.data;
  const back = await api('PUT', '/desk/happiness/settings', { ...strip(H0), row_version: cur?.row_version });
  const now = (await api('GET', '/desk/happiness/settings')).j?.data;
  const same = ['is_enabled', 'department_scope_enabled'].every(k => JS(now?.[k]) === JS(H0[k])) && JS(now?.department_ids) === JS(H0.department_ids);
  R('P4-RESTORE-HAPPINESS', same ? 'PASS' : 'FAIL', `Customer Happiness restored → ${E(back)}; enabled ${now?.is_enabled}, scope ${now?.department_scope_enabled}, depts ${JS(now?.department_ids)}`, { extra: 'cleanup' });
}
// ---------- Business hours Mon–Fri (24 h) + holiday, ~15 min window
const bhBody = o => { const c = { ...o }; for (const k of ['evaluated_at', 'is_open_now', 'next_opens_at', 'todays_holidays', 'profiles', 'holiday_lists', 'is_seeded']) delete c[k]; return c; };
try {
  const put = await api('PUT', '/desk/business-hours', { ...bhBody(BH0), preset: '24_5', timing_mode: 'same', days_active: ['mon', 'tue', 'wed', 'thu', 'fri'], hours: { open: '00:00', close: '23:59' } });
  log('bh Mon-Fri', E(put));
  if (!ok(put)) { R('TM-06', 'BLOCKED', 'could not switch default business hours to Mon–Fri: ' + E(put)); }
  else {
    const g = 'BH' + uid();
    await mkBp(DEF(g, [ST('Open', { slaMinutes: 5760, slaClock: 'business' }), ST('On Hold', { slaMinutes: 5760, slaClock: 'calendar' }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('hold', 'Open', 'On Hold'), TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed'), TR('end2', 'On Hold', 'Closed')]));
    const tb = await mkT(g, 'business'); const s0 = await waitIn(tb); await sleep(30000); const sB = await bstate(tb);
    const tc = await mkT(g, 'calendar'); await waitIn(tc); await runT(tc, 'hold'); await sleep(30000); const sC = await bstate(tc);
    const ent = new Date(sB.enteredAt || sB.entered_at), dueB = new Date(dueOf(sB.escalation_due_at)), dueC = new Date(dueOf(sC.escalation_due_at)), entC = new Date(sC.enteredAt || sC.entered_at);
    const dB = (dueB - ent) / 86400000, dC = (dueC - entC) / 86400000;
    // 4 working days from Tue → Mon (6 calendar days: Sat + Sun skipped)
    both('TM-06', 'NDC-2774', Math.abs(dB - 6) < 0.05 && Math.abs(dC - 4) < 0.05, `limit 4 days: business clock entered ${sB.enteredAt} due ${JS(sB.escalation_due_at)} (${dB.toFixed(2)} calendar days, expect 6 = weekend skipped); calendar clock due after ${dC.toFixed(2)} days (expect 4); provisional ${JS(sB.provisional ?? sB.dueProvisional ?? '-')}`);
    R('ST-04', Math.abs(dB - dC) > 1 ? 'PASS' : 'FAIL', `business vs calendar clock give different due times (${dB.toFixed(2)} vs ${dC.toFixed(2)} days); example text checked in Phase 3`);
    // TM-07 holiday on Thu 26 Nov via a holiday list linked to the default hours
    const hl = await api('POST', '/desk/holiday-lists', { name: 'QA BP R HOL', description: null, is_active: true, category: 'year_specific', holidays: [{ name: 'QA BP R holiday', start_date: '2026-11-26', end_date: '2026-11-26', occurrence: 'year_specific' }] });
    const hlId = hl.j?.data?.id; log('holiday list', E(hl));
    let link = { s: 0 }; if (hlId) { MADE.temp.push({ kind: 'holiday', id: hlId }); keep(); const cur = (await api('GET', '/desk/business-hours')).j?.data; link = await api('PUT', '/desk/business-hours', { ...bhBody(cur), holiday_list_ids: [...(cur.holiday_lists || []).map(x => x.id), hlId] }); }
    const th = await mkT(g, 'holiday'); await waitIn(th); await sleep(30000); const sH = await bstate(th);
    const dH = (new Date(dueOf(sH.escalation_due_at)) - new Date(sH.enteredAt || sH.entered_at)) / 86400000;
    const linked = JS((await api('GET', '/desk/business-hours')).j?.data?.holiday_lists || '').includes(hlId || 'zz');
    R('TM-07', linked ? (Math.abs(dH - 7) < 0.05 ? 'PASS' : 'FAIL') : 'INCONCLUSIVE', `holiday Thu 26 Nov (list ${E(hl)}, linked to default hours ${linked} via ${E(link)}): due after ${dH.toFixed(2)} days (expect 7)`);
    // TM-08 per-state business hours set
    const profs = (await api('GET', '/desk/business-hours')).j?.data?.profiles || []; const other = profs.find(p => !p.is_default) || profs[0];
    const gp = 'BHP' + uid(); await mkBp(DEF(gp, [ST('Open', { slaMinutes: 5760, slaClock: 'business', slaBusinessHoursId: other?.id }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
    const tp = await mkT(gp, 'profile'); await waitIn(tp); await sleep(30000); const sP = await bstate(tp);
    const dP = (new Date(dueOf(sP.escalation_due_at)) - new Date(sP.enteredAt || sP.entered_at)) / 86400000;
    R('TM-08', other && Math.abs(dP - dH) > 0.01 ? 'PASS' : 'INCONCLUSIVE', `state uses business hours "${other?.name}" (${JS(other?.days_active)} ${JS(other?.hours)}): due after ${dP.toFixed(2)} days vs ${dH.toFixed(2)} on the default hours`);
    if (hlId) { const d = await api('DELETE', `/desk/holiday-lists/${hlId}`); log('holiday list delete', d.s); MADE.temp = MADE.temp.filter(x => x.id !== hlId); keep(); }
  }
} finally {
  const cur = (await api('GET', '/desk/business-hours')).j?.data;
  const back = await api('PUT', '/desk/business-hours', { ...bhBody(BH0), holiday_list_ids: (BH0.holiday_lists || []).map(x => x.id), ...(cur?.row_version ? { row_version: cur.row_version } : {}) });
  const now = (await api('GET', '/desk/business-hours')).j?.data;
  const same = ['preset', 'timing_mode', 'days_active', 'hours', 'hours_per_day', 'time_zone', 'week_starts_on', 'slots', 'slots_per_day'].every(k => JS(now?.[k]) === JS(BH0[k])) && JS((now?.holiday_lists || []).map(x => x.id)) === JS((BH0.holiday_lists || []).map(x => x.id));
  R('P4-RESTORE-BH', same ? 'PASS' : 'FAIL', `business hours restored → ${E(back)}; preset ${now?.preset}, days ${JS(now?.days_active)}, holiday lists ${(now?.holiday_lists || []).length} (was ${(BH0.holiday_lists || []).length})`, { extra: 'cleanup' });
}
return await cleanup();
