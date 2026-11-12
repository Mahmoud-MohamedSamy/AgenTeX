const B = { preset: 'custom', days_active: ['mon','tue','wed','thu','fri','sat','sun'], timing_mode: 'same', hours: { open: '01:00', close: '23:00' }, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' };
const waitFor = async p => { for (let i = 0; i < 30; i++) { const d = (await api('GET', '/desk/business-hours')).j?.data; if (d && d.preset === p) return i * 5 + 's ' + d.preset + ' open=' + d.is_open_now; await sleep(5000); } return 'timeout'; };
const R = {};
R.set = (await api('PUT', '/iam/tenant/business-hours', B)).s; R.seen = await waitFor('custom'); await sleep(10000);
const rules = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).filter(r => /^QA AO WF BH P11/.test(r.name));
const t = await mkTicket('BH P11', {}, 'with hours 2'); await sleep(15000);
const ex = await execs(t.id); R.p11 = Object.fromEntries(rules.map(r => [r.name.replace('QA AO WF BH ', ''), (ex.find(e => e.rule === r.id) || {}).outcome || 'no row']));
R.back = (await api('PUT', '/iam/tenant/business-hours', { preset: '24_7', days_active: B.days_active, timing_mode: null, hours: null, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' })).s; R.seenBack = await waitFor('24_7');
log(R);
