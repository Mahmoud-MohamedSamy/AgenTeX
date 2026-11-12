// P11 with real business hours: set 01:00-23:00 every day (fits Shift-01), run the three execution-time rules, revert to 24/7.
const orig = (await api('GET', '/desk/business-hours')).j?.data; fs.writeFileSync('../a4/bh-orig2.json', JSON.stringify(orig, null, 1));
const set = await api('PUT', '/iam/tenant/business-hours', { preset: 'custom', days_active: ['mon','tue','wed','thu','fri','sat','sun'], timing_mode: 'same', hours: { open: '01:00', close: '23:00' }, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' });
const now = (await api('GET', '/desk/business-hours')).j?.data;
const R = { set: set.s + ' ' + (set.s >= 300 ? set.t.slice(0, 200) : ''), now: now.preset + ' open=' + now.is_open_now + ' ' + JSON.stringify(now.hours) };
const rules = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).filter(r => /^QA AO WF BH P11/.test(r.name));
const t = await mkTicket('BH P11', {}, 'with hours'); await sleep(15000);
const ex = await execs(t.id); R.p11 = Object.fromEntries(rules.map(r => [r.name.replace('QA AO WF BH ', ''), (ex.find(e => e.rule === r.id) || {}).outcome || 'no row']));
const back = await api('PUT', '/iam/tenant/business-hours', { preset: '24_7', days_active: orig.days_active, timing_mode: null, hours: null, hours_per_day: null, week_starts_on: orig.week_starts_on, time_zone: orig.time_zone });
const fin = (await api('GET', '/desk/business-hours')).j?.data; R.reverted = back.s + ' → ' + fin.preset + ' ' + JSON.stringify(fin.hours);
log(R);
