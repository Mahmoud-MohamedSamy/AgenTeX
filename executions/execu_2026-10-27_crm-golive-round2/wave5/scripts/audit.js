const r = await call('GET', '/audit/logs?limit=100&from=2026-10-28T06:00:00Z');
const r2 = r.s === 200 ? r : await call('GET', '/audit/events?limit=100');
const d = r2.j && (r2.j.data.items || r2.j.data) || [];
const hits = (Array.isArray(d) ? d : []).filter(x => /company|tenant|time_zone|timezone|profile/i.test(JSON.stringify(x))).slice(0, 10).map(x => JSON.stringify(x).slice(0, 400));
const c = await call('GET', '/iam/tenant/company-profile');
return { s: r.s, s2: r2.s, n: Array.isArray(d) ? d.length : 0, hits, now: c.j.data.time_zone, updated: c.j.data.updated_at || c.j.data.updatedAt };
