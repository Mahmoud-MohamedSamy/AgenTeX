const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065';
const f = arr((await api('GET', `/modules/${T}/fields`)).j.data).filter(x => /priority|status|due|owner|subject|tag/i.test(x.fieldName)).map(x => x.fieldName + ':' + x.datatypeKey + ' ' + JSON.stringify(x.config?.allowed_values || '').slice(0, 120));
const buckets = {}; for (const b of ['overdue', 'today', 'today_and_overdue', 'all']) { const r = await api('GET', `/workqueue/activities?module_id=${T}&bucket=${b}`); buckets[b] = r.s + ' ' + (r.j?.meta?.total_count ?? arr(r.j?.data).length); }
await go('/workqueue/activities/tasks', 10000);
return done({ f, buckets, page: (await txt()).split('Meetings')[1]?.slice(0, 700) });
