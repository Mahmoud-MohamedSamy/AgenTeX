// K9 rerun: Mon–Fri business hours, holiday on Mon 16 Nov, 48 business-hour state limit entered on Friday. Reverted in finally.
const BH = '/iam/tenant/business-hours'; let hol = null, changed = false;
const cairo = d => d && new Date(d.at || d).toLocaleString('en-GB', { timeZone: 'Africa/Cairo', weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const waitBh = async p => { for (let i = 0; i < 30; i++) { const d = (await api('GET', '/desk/business-hours')).j?.data; if (d && d.preset === p) return true; await sleep(4000); } return false; };
const due = async id => { let s = null; for (let i = 0; i < 20; i++) { s = await bstate(id); if (s?.escalation_due_at && s.escalation_due_at.provisional === false) break; await sleep(5000); } return cairo(s?.escalation_due_at) + (s?.escalation_due_at?.provisional ? ' (provisional)' : ''); };
try {
  const set = await api('PUT', BH, { preset: '24_5', days_active: ['mon', 'tue', 'wed', 'thu', 'fri'], timing_mode: 'same', hours: { open: '00:00', close: '23:59' }, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' });
  changed = set.s < 300; await waitBh('24_5');
  const b = await mkBp(DEF('K9', [ST('Open', { slaMinutes: 2880, slaClock: 'business' }), ST('Closed', { isTerminal: true })], [TR('end', 'Open', 'Closed')]));
  const t1 = await mkT('K9', 'no holiday'); out('noHoliday', await due(t1));
  const lists = (await api('GET', '/desk/business-hours')).j?.data?.holiday_lists || [];
  const hl = lists.find(x => /AS6 HOL today/.test(x.name)) || lists[0];
  const add = await api('POST', `/desk/holiday-lists/${hl.id}/holidays`, { name: 'QA BP K9 holiday', start_date: '2026-11-16', end_date: '2026-11-16' }); hol = add.j?.data?.id ? { list: hl.id, id: add.j.data.id } : null;
  const hs = L((await api('GET', `/desk/holiday-lists/${hl.id}`)).j?.data?.holidays).map(h => [h.name, h.date || h.start_date || h.starts_on, h.end_date || h.ends_on]);
  out('holiday', { list: hl.name, add: E(add), stored: hs });
  await sleep(5000); const t2 = await mkT('K9', 'with holiday'); out('withHoliday', await due(t2));
} catch (e) { out('ERROR', String(e.stack || e).slice(0, 400)); }
finally {
  if (hol) out('remove', E(await api('DELETE', `/desk/holiday-lists/${hol.list}/holidays/${hol.id}`)));
  if (changed) out('restore', E(await api('PUT', BH, { preset: '24_7', days_active: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], timing_mode: null, hours: null, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' })) + ' seen ' + await waitBh('24_7'));
  out('cleanup', await cleanAll()); log(JSON.stringify(R, null, 1));
}
