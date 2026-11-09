// NDC-2655: GET /iam/tenant/business-hours → PUT the same body back (unchanged) ×2 → must be 200; compare after.
const B = '/iam/tenant/business-hours'; const out = {};
const g = await api('o', 'GET', B); const d = g.j?.data; out.get = g.s; out.stored = JSON.stringify(d).slice(0, 600);
const keep = ['preset', 'days_active', 'timing_mode', 'hours', 'hours_per_day', 'week_starts_on', 'time_zone', 'slots', 'slots_per_day'];
const body = Object.fromEntries(keep.filter(k => d && k in d).map(k => [k, d[k]]));
const p1 = await api('o', 'PUT', B, body); out.putUnchanged1 = p1.s + ' ' + (p1.s > 299 ? p1.t.slice(0, 250) : '');
const p2 = await api('o', 'PUT', B, body); out.putUnchanged2 = p2.s + ' ' + (p2.s > 299 ? p2.t.slice(0, 250) : '');
const a = (await api('o', 'GET', B)).j?.data; out.sameAfter = JSON.stringify(Object.fromEntries(keep.filter(k => a && k in a).map(k => [k, a[k]]))) === JSON.stringify(body);
// the check still works: 24_7 with only 6 days
if (d?.preset === '24_7') { const bad = { ...body, days_active: (body.days_active || []).filter(x => x !== 'sun') }; const r = await api('o', 'PUT', B, bad); out.brokenRefused = r.s + ' ' + r.t.slice(0, 200); }
return out;
