const items = []; let cur = null;
for (let i = 0; i < 6; i++) { const ev = await api('GET', '/audit/events?limit=100' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); items.push(...arr(ev.j?.data)); cur = ev.j?.meta?.next_cursor; if (!cur) break; }
const since = items.filter(x => x.occurred_at >= '2026-10-21T10:00:00');
const tt = {}; for (const x of since) { const k = x.target_type + ' / ' + x.action; tt[k] = (tt[k] || 0) + 1; }
const pip = since.filter(x => /pipeline|stage/i.test(x.target_type + ' ' + x.target_label)).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + ' ' + x.target_type + ' ' + x.target_label);
return done({ n: items.length, since: since.length, oldest: items.at(-1)?.occurred_at, tt, pip });
