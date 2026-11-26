// TM-06 / TM-07 / TM-08 / ST-04: default business-hours profile switched to Mon–Fri 24 h + a holiday for a few minutes, then restored.
const bh = (await api('GET', '/desk/business-hours')).j?.data; const profs = bh.profiles || [];
const def = profs.find(p => p.is_default) || profs[0]; const other = profs.find(p => p.id !== def.id);
const P0r = await api('GET', '/iam/tenant/business-hours'); const P0 = P0r.j?.data; if (!P0) { R('TM-06', 'BLOCKED', 'cannot read /iam/tenant/business-hours: ' + E(P0r)); return { stop: true }; } const HL0 = (await api('GET', `/desk/business-hours/${def.id}/holiday-lists`)).j?.data;
fs.writeFileSync(RUN + '/baseline/p4-bh-profile-orig.json', JSON.stringify({ P0, HL0, other }, null, 1));
const body = o => { const c = { ...o }; for (const k of ['id', 'evaluated_at', 'is_open_now', 'next_opens_at', 'todays_holidays', 'holiday_lists', 'created_at', 'updated_at', 'created_by', 'is_seeded']) delete c[k]; return c; };
const days = async (t) => { const s = await bstate(t); const a = new Date(s.enteredAt || s.entered_at), d = new Date(dueOf(s.escalation_due_at)); return { d: (d - a) / 86400000, due: dueOf(s.escalation_due_at), prov: s.escalation_due_at?.provisional }; };
let hlId = null;
try {
  const put = await api('PUT', '/iam/tenant/business-hours', { ...body(P0), preset: '24_5', timing_mode: 'same', days_active: ['mon', 'tue', 'wed', 'thu', 'fri'], hours: { open: '00:00', close: '23:59' } });
  log('default profile Mon–Fri', E(put));
  if (!ok(put)) { R('TM-06', 'BLOCKED', 'could not switch the default business hours to Mon–Fri: ' + E(put)); }
  else {
    const g = 'BH' + uid();
    await mkBp(DEF(g, [ST('Open', { slaMinutes: 5760, slaClock: 'business' }), ST('On Hold', { slaMinutes: 5760, slaClock: 'calendar' }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('hold', 'Open', 'On Hold'), TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed'), TR('end2', 'On Hold', 'Closed')]));
    const tb = await mkT(g, 'business'); await waitIn(tb); const tc = await mkT(g, 'calendar'); await waitIn(tc); await runT(tc, 'hold'); await sleep(30000);
    const B1 = await days(tb), C1 = await days(tc);
    both('TM-06', 'NDC-2774', Math.abs(B1.d - 6) < 0.05 && Math.abs(C1.d - 4) < 0.05, `limit 4 days, entered Tue: business clock due ${B1.due} (${B1.d.toFixed(2)} calendar days; expect 6 = Sat + Sun skipped, provisional ${B1.prov}); calendar clock ${C1.d.toFixed(2)} days (expect 4)`);
    R('ST-04', Math.abs(B1.d - C1.d) > 1 ? 'PASS' : 'FAIL', `business vs calendar clock: ${B1.d.toFixed(2)} vs ${C1.d.toFixed(2)} days (example text on screen in Phase 3)`);
    // holiday Thu 26 Nov
    const hl = await api('POST', '/desk/holiday-lists', { name: 'QA BP R HOL', description: null, is_active: true, category: 'year_specific' }); hlId = hl.j?.data?.id;
    let addH = { s: 0 }, link = { s: 0 };
    if (hlId) { MADE.temp.push({ kind: 'holiday', id: hlId }); keep(); addH = await api('POST', `/desk/holiday-lists/${hlId}/holidays`, { name: 'QA BP R holiday', start_date: '2026-11-26', end_date: '2026-11-26', occurrence: 'year_specific' });
      const cur = L(HL0).map(x => x.id || x.holiday_list_id).filter(Boolean); link = await api('PUT', `/desk/business-hours/${def.id}/holiday-lists`, { holiday_list_ids: [...cur, hlId] }); if (!ok(link)) link = await api('PUT', `/desk/business-hours/${def.id}/holiday-list`, { holiday_list_id: hlId }); }
    await sleep(3000); const th = await mkT(g, 'holiday'); await waitIn(th); await sleep(30000); const Hd = await days(th);
    R('TM-07', ok(link) ? (Math.abs(Hd.d - 7) < 0.05 ? 'PASS' : 'FAIL') : 'INCONCLUSIVE', `holiday Thu 26 Nov (list ${E(hl)}, holiday ${E(addH)}, linked ${E(link)}): business 4 days due after ${Hd.d.toFixed(2)} days (expect 7)`);
    // per-state set
    if (other) { const gp = 'BHP' + uid(); await mkBp(DEF(gp, [ST('Open', { slaMinutes: 5760, slaClock: 'business', slaBusinessHoursId: other.id }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
      const tp = await mkT(gp); await waitIn(tp); await sleep(30000); const Pd = await days(tp);
      R('TM-08', Math.abs(Pd.d - Hd.d) > 0.01 ? 'PASS' : 'FAIL', `state on business hours "${other.name}" (${JS(other.days_active)} ${JS(other.hours || other.preset)}): due after ${Pd.d.toFixed(2)} days vs ${Hd.d.toFixed(2)} on the default hours`); }
    else R('TM-08', 'BLOCKED', 'only one business-hours profile');
  }
} finally {
  const back = await api('PUT', '/iam/tenant/business-hours', body(P0));
  const cur = L(HL0).map(x => x.id || x.holiday_list_id).filter(Boolean);
  const hb = await api('PUT', `/desk/business-hours/${def.id}/holiday-lists`, { holiday_list_ids: cur });
  if (hlId) { const d = await api('DELETE', `/desk/holiday-lists/${hlId}`); MADE.temp = MADE.temp.filter(x => x.id !== hlId); keep(); log('holiday list delete', d.s); }
  const now = (await api('GET', '/iam/tenant/business-hours')).j?.data; const hlNow = (await api('GET', `/desk/business-hours/${def.id}/holiday-lists`)).j?.data;
  const keys = ['preset', 'timing_mode', 'days_active', 'hours', 'hours_per_day', 'time_zone', 'slots', 'slots_per_day'];
  const same = keys.every(k => JS(now?.[k]) === JS(P0[k])) && JS(L(hlNow).map(x => x.id)) === JS(L(HL0).map(x => x.id));
  R('P4-RESTORE-BH', same ? 'PASS' : 'FAIL', `default business hours restored → ${E(back)} / holiday lists ${E(hb)}; preset ${now?.preset}, days ${JS(now?.days_active)}, linked lists ${L(hlNow).length} (was ${L(HL0).length})`, { extra: 'cleanup' });
}
return await cleanup();
