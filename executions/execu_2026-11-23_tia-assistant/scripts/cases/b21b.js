const out = [];
for (const q of ['app_key=agents', 'target_type=agent', `target_id=${AGENT}`]) { const r = await api('GET', `/audit/events?limit=100&${q}`); const L = arr(r.j?.data); out.push({ q, s: r.s, n: L.length, rows: L.slice(0, 25).map(e => [e.occurred_at?.slice(11,19), e.action, e.target_type, e.target_label, e.actor_label].join(' | ')) }); }
const recent = arr((await api('GET', '/audit/events?limit=100')).j?.data).filter(e => e.occurred_at > '2026-11-23T14:00').map(e => [e.occurred_at?.slice(11,19), e.app_key, e.action, e.target_type, e.target_label, e.actor_label].join(' | ')).slice(0, 40);
return { out, recent };
