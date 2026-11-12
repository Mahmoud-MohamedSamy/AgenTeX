const B = { preset: 'custom', days_active: ['mon','tue','wed','thu','fri','sat','sun'], timing_mode: 'same', hours: { open: '01:00', close: '23:00' }, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' };
const B247 = { preset: '24_7', days_active: B.days_active, timing_mode: null, hours: null, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' };
const waitFor = async p => { for (let i = 0; i < 30; i++) { const d = (await api('GET', '/desk/business-hours')).j?.data; if (d && d.preset === p) return d.preset + ' open=' + d.is_open_now; await sleep(5000); } return 'timeout'; };
const C = v => ({ kind: 'Comparison', field: 'executionTime', operator: 'Equal', negate: false, value: { kind: 'string', stringValue: v } });
const mark = k => [{ type: 'AddTicketComment', commentBody: `QA AO WF P11m ${k} fired`, commentPublic: false }];
const rules = {}; for (const v of ['business_hours', 'outside_business_hours', 'holiday']) rules[v] = await mkRule('P11m', { kind: 'RecordCreated' }, mark(v), { criteria: C(v), name: 'QA AO WF P11m ' + v });
const R = { rules: Object.fromEntries(Object.entries(rules).map(([k, r]) => [k, r.s])) }; const tickets = [];
const run = async lbl => { const t = await mkTicket('P11m', {}, lbl); tickets.push(t.id); await sleep(15000); const ex = arr2((await api('GET', `/workflow/executions?recordId=${t.id}`)).j?.data);
  return { num: (await getTicket(t.id)).ticket_number, ...Object.fromEntries(Object.entries(rules).map(([k, r]) => [k, (ex.find(e => e.ruleId === r.id) || {}).outcome || 'no row'])) }; };
try {
  R.bh247 = await waitFor('24_7'); R.phaseA = await run('24x7');
  R.set = (await api('PUT', '/iam/tenant/business-hours', B)).s; R.bhCustom = await waitFor('custom'); await sleep(5000); R.phaseB = await run('closed now');
} finally { R.back = (await api('PUT', '/iam/tenant/business-hours', B247)).s; R.seenBack = await waitFor('24_7'); }
fs.writeFileSync('../a4/p11re.json', JSON.stringify({ rules: Object.fromEntries(Object.entries(rules).map(([k, r]) => [k, r.id])), tickets, R }, null, 1));
log(JSON.stringify(R, null, 1));
