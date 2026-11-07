const o = {}; const ps = await api('o', 'GET', 'desk:/iam/tenant/business-hours/profiles'); const base = arr(ps.j?.data).find(p => p.is_default); o.n = arr(ps.j?.data).length; o.keys = Object.keys(base);
const r = await api('o', 'POST', 'desk:/iam/tenant/business-hours/profiles', { name: 'QA RT12 2799 BH', preset: 'custom', days_active: ['sun', 'mon', 'tue', 'wed', 'thu'], timing_mode: 'same', hours: { open: '09:00', close: '17:00' }, hours_per_day: null, week_starts_on: base.week_starts_on, time_zone: base.time_zone });
o.create = X.err(r) + ' ' + (r.s >= 400 ? r.t.slice(0, 300) : ''); o.id = r.j?.data?.id; if (o.id) ledger('NDC-2799: business-hours set "QA RT12 2799 BH" ' + o.id + ' (Sun–Thu 09–17) — delete at cleanup');
return o;
