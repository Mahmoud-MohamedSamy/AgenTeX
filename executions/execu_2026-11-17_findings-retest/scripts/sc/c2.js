const q = 'app_key=iam&app_key=crm&app_key=workflow&app_key=mail&app_key=metadata-engine&app_key=settings-gateway&app_key=timeline&app_key=metadata&app_key=notify&app_key=billing&app_key=messaging&app_key=audit';
let r = await api('GET', '/audit/events?' + q); const o = { s: r.s, meta: JSON.stringify(Object.keys(r.j)), pg: JSON.stringify(r.j.meta || r.j.pagination || r.j.next || '').slice(0, 300) };
let ev = arr(r.j.data); let cur = r.j.meta && (r.j.meta.next_cursor || r.j.meta.cursor);
for (let i = 0; i < 20 && cur; i++) { const x = await api('GET', '/audit/events?' + q + '&cursor=' + encodeURIComponent(cur)); ev = ev.concat(arr(x.j.data)); cur = x.j.meta && (x.j.meta.next_cursor || x.j.meta.cursor); if (ev.length && ev[ev.length - 1].occurred_at < '2026-11-17T06:00') break; }
o.n = ev.length; o.oldest = ev.length && ev[ev.length - 1].occurred_at;
const S = e => JSON.stringify(e);
o.byApp = {}; for (const e of ev) o.byApp[e.app_key] = (o.byApp[e.app_key] || 0) + 1;
o.types = {}; for (const e of ev) o.types[e.app_key + ':' + e.target_type] = (o.types[e.app_key + ':' + e.target_type] || 0) + 1;
o.desky = ev.filter(e => /desk|ticket|RT2[01] (TK|WF|BP|AC)|department/i.test(S(e).replace(/"source_[a-z_]+":"[^"]*"/g, ''))).slice(0, 30).map(e => [e.occurred_at.slice(0, 19), e.app_key, e.action, e.target_type, e.target_label, JSON.stringify(e.changes || '').slice(0, 250), JSON.stringify(e.metadata || '').slice(0, 200)]);
return o;
