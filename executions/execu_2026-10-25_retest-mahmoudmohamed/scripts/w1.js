const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', ME = '3445ec4a-020e-4f12-b156-dd2de7610164';
const s = v => ({ kind: 'string', value: v }); const now = Date.now(); const iso = ms => new Date(ms).toISOString().replace(/\.\d+Z$/, 'Z'); const H = 3600e3, D = 24 * H;
// Cairo is UTC+3 on 25 Oct 2026; "today" = Cairo day
const cairoNow = new Date(now + 3 * H); const endCairoToday = Date.UTC(cairoNow.getUTCFullYear(), cairoNow.getUTCMonth(), cairoNow.getUTCDate(), 23, 0) - 3 * H;
const plan = [['t01', -1 * D, 'high', 'Not Started'], ['t02', -2 * D, 'low', 'In Progress'], ['t03', Math.min(now + 2 * H, endCairoToday - 10 * 60e3) - now, 'high', 'Not Started'], ['t04', Math.min(now + 3 * H, endCairoToday - 5 * 60e3) - now, 'normal', 'Not Started'], ['t05', 3 * D, 'highest', 'Not Started'], ['t06', 20 * D, 'high', 'Deferred'], ['t07', null, 'low', 'Not Started'], ['t08', -1 * D, 'high', 'Completed'], ['t09', Math.min(now + 1 * H, endCairoToday - 15 * 60e3) - now, 'high', 'Completed'], ['t10', -10 * D, 'normal', 'Waiting on someone else']];
const out = [];
for (const [n, off, pr, st] of plan) { const data = [{ field: 'subject', value: s('QA RT wq ' + n) }, { field: 'owner', value: s(ME) }, { field: 'priority', value: s(pr) }, { field: 'status', value: s(st) }]; if (off !== null) data.push({ field: 'due_date', value: s(iso(now + off)) });
  const r = await api('POST', `/modules/${T}/records`, { data }); out.push(n + ' ' + r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 120)) + ' due ' + (off === null ? '—' : iso(now + off)) + ' ' + pr + ' ' + st); }
const buckets = {}; for (const b of ['overdue', 'today', 'today_and_overdue', 'next_7_days', 'all']) { const r = await api('GET', `/workqueue/activities?module_id=${T}&bucket=${b}`); buckets[b] = r.s + ' ' + (r.j?.meta?.total_count ?? arr(r.j?.data).length) + ' ' + arr(r.j?.data).map(x => (x.data || []).find(f => f.field === 'subject')?.value?.value || x.subject || '').join('|'); }
return done({ nowUTC: iso(now), out, buckets });
