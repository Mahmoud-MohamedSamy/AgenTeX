const r = await api('GET', '/audit/events?limit=200');
const L = arr(r.j?.data);
const mine = L.filter(e => JSON.stringify(e).includes(AGENT) || /agent/i.test(e.module_key || e.entity_type || e.resource_type || ''));
const keys = L[0] ? Object.keys(L[0]) : [];
const sum = mine.slice(0, 40).map(e => [e.occurred_at || e.created_at || e.at, e.action || e.event_type || e.operation, e.module_key || e.entity_type, e.record_label || e.entity_label || e.summary, e.actor_label || e.user_label].join(' | '));
return { s: r.s, n: L.length, keys, mine: mine.length, sum };
