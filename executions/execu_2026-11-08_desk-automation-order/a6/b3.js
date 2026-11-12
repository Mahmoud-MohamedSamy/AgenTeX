// Batch 3 (NDC-Staging, tenant-wide changes, all reverted in finally): C9–C11 Add State, C20/NDC-2775 status removal, G6/K8 (NDC-2774) weekend in business clock, K9 holiday.
const BH = '/iam/tenant/business-hours'; const NEW = []; let fieldBase = null, bhChanged = false, hol = null;
const field = async () => L((await api('GET', `/modules/${TK}/fields?take=300`)).j?.data).find(x => x.apiName === 'status' || x.fieldName === 'status');
const putVals = (f, vals) => api('PUT', `/modules/${TK}/fields/${f.id}`, { fieldName: f.fieldName, labels: f.labels || {}, datatypeKey: f.datatypeKey, datatypeOptions: { ...f.datatypeOptions, allowed_values: vals }, required: !!(f.required || f.config?.required), unique: !!(f.unique || f.config?.unique) });
const vals = f => (f.datatypeOptions?.allowed_values || []).map(v => typeof v === 'string' ? v : (v.value || v.label));
const cairo = d => d && new Date(d.at || d).toLocaleString('en-GB', { timeZone: 'Africa/Cairo', weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const waitBh = async p => { for (let i = 0; i < 30; i++) { const d = (await api('GET', '/desk/business-hours')).j?.data; if (d && d.preset === p) return true; await sleep(4000); } return false; };
try {
  fieldBase = await field(); out('statusBefore', vals(fieldBase));
  // C9 / C10 / C11
  const add = async (name, type = 'open') => { const r = await api('POST', '/desk/blueprints/states', { name, type }); if (r.s < 300) NEW.push(name); return E(r); };
  out('C9', { add: await add('QA BP Verify'), inStatuses: vals(await field()).includes('QA BP Verify'), statusSettings: JSON.stringify(L((await api('GET', '/desk/ticket-statuses')).j?.data).find(s => (s.name || s.value || s.label) === 'QA BP Verify') || null).slice(0, 200) });
  out('C10', { Open: await add('Open'), open: await add('open'), qaVerifyAgain: await add('QA BP Verify') });
  out('C11', { arabic: await add('QA BP تحقق'), emoji: await add('QA BP ✅ done', 'closed'), long100: await add('QA BP ' + 'L'.repeat(94)), long300: await add('QA BP ' + 'M'.repeat(294)), script: await add('QA BP <img src=x onerror=alert(1)>'), spaces: await add('   ') });
  out('C11_stored', vals(await field()).filter(v => /^QA BP/.test(v)).map(v => v.length > 40 ? v.slice(0, 20) + '…(' + v.length + ')' : v));
  // C20 / NDC-2775: status used by a live blueprint, no ticket inside
  const b20 = await mkBp(DEF('C20', [ST('Open'), ST('QA BP Verify'), ST('Closed', { isTerminal: true })], [TR('v', 'Open', 'QA BP Verify'), TR('end', 'QA BP Verify', 'Closed')]));
  const f1 = await field(); const rm = await putVals(f1, vals(f1).filter(v => v !== 'QA BP Verify'));
  out('C20_noTicket', { remove: E(rm), stillThere: vals(await field()).includes('QA BP Verify') });
  const t20 = await mkT('C20'); await waitIn(t20); const rv = await runT(t20, 'v'); await sleep(2000);
  const f2 = await field(); const rm2 = vals(f2).includes('QA BP Verify') ? await putVals(f2, vals(f2).filter(v => v !== 'QA BP Verify')) : null;
  out('C20_withTicket', { run: E(rv), status: (await flds(t20)).status, remove: rm2 && E(rm2) });
  // G6 / K8 (NDC-2774): business hours Mon–Fri, state limit 48 business hours, entered on Friday
  const orig = (await api('GET', '/desk/business-hours')).j?.data; fs.writeFileSync('../a6/bh-orig.json', JSON.stringify(orig, null, 1));
  let set = await api('PUT', BH, { preset: '24_5', days_active: ['mon', 'tue', 'wed', 'thu', 'fri'], timing_mode: 'same', hours: { open: '00:00', close: '23:59' }, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' });
  if (set.s >= 300) set = await api('PUT', BH, { preset: 'custom', days_active: ['mon', 'tue', 'wed', 'thu', 'fri'], timing_mode: 'same', hours: { open: '01:00', close: '23:00' }, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' });
  bhChanged = set.s < 300; out('BH_set', E(set)); const seen = bhChanged ? await waitBh(set.j?.data?.preset || ((await api('GET', '/desk/business-hours')).j?.data?.preset)) : false;
  const now = (await api('GET', '/desk/business-hours')).j?.data; out('BH_now', { preset: now?.preset, days: now?.days_active, hours: now?.hours, open: now?.is_open_now });
  if (bhChanged) {
    const g6 = await mkBp(DEF('G6', [ST('Open', { slaMinutes: 2880, slaClock: 'business' }), ST('Escalated', { slaMinutes: 2880, slaClock: 'calendar' }), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
    const tb = await mkT('G6', 'business'); let s = null; const samples = [];
    for (let i = 0; i < 20; i++) { s = await bstate(tb); if (s) { samples.push((s.escalation_due_at?.provisional ? 'prov ' : 'settled ') + cairo(s.escalation_due_at)); if (s.escalation_due_at && s.escalation_due_at.provisional === false) break; } await sleep(5000); }
    const enteredB = cairo(s?.enteredAt); await runT(tb, 'go'); await sleep(4000); const sc = await bstate(tb);
    out('G6_K8', { entered: enteredB, business48h: samples.slice(-1)[0], calendar48h_after_move: cairo(sc?.escalation_due_at), samples: samples.slice(0, 3) });
    // K9: a holiday on the next working day
    const hl = (now.holiday_lists || []).find(x => x.is_active) || (now.holiday_lists || [])[0];
    if (hl) { const r = await api('POST', `/desk/holiday-lists/${hl.id}/holidays`, { name: 'QA BP K9 holiday', date: '2026-11-16', start_date: '2026-11-16', end_date: '2026-11-16' }); hol = r.j?.data?.id ? { list: hl.id, id: r.j.data.id } : null; out('K9_add', E(r) + ' list ' + hl.name);
      const tk = await mkT('G6', 'holiday'); let s9 = null; const sm = [];
      for (let i = 0; i < 20; i++) { s9 = await bstate(tk); if (s9) { sm.push(cairo(s9.escalation_due_at) + (s9.escalation_due_at?.provisional ? ' prov' : '')); if (s9.escalation_due_at && s9.escalation_due_at.provisional === false) break; } await sleep(5000); }
      out('K9', { listProfile: hl.business_hour_profile_id || 'none', due: sm.slice(-1)[0] }); }
  }
} catch (e) { out('ERROR', String(e.stack || e).slice(0, 500)); }
finally {
  if (hol) out('K9_remove', E(await api('DELETE', `/desk/holiday-lists/${hol.list}/holidays/${hol.id}`)));
  if (bhChanged) { const back = await api('PUT', BH, { preset: '24_7', days_active: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], timing_mode: null, hours: null, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' }); out('BH_restore', E(back) + ' seen ' + await waitBh('24_7')); }
  out('cleanup', await cleanAll());
  const f = await field(); const keepVals = vals(f).filter(v => !NEW.includes(v)); const r = NEW.length ? await putVals(f, keepVals) : null;
  const after = vals(await field()); out('status_restore', { put: r && E(r), after, sameAsBefore: JSON.stringify(after) === JSON.stringify(vals(fieldBase)) });
  fs.writeFileSync('../a6/b3-out.json', JSON.stringify(R, null, 1)); log(JSON.stringify(R, null, 1));
}
