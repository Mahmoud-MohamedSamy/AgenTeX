for (const q of ['?limit=100&q=help', '?limit=100&entity_type=help_center', '?limit=200']) {
  const r = await api('GET', '/audit/events' + q); const L = arr(D(r.j));
  const hits = L.filter(x => /help.?cent|access/i.test(JSON.stringify(x).slice(0, 3000)) && (x.created_at || x.occurred_at || '') > '2026-11-12T09');
  out[q] = r.s + ' n=' + L.length + ' ' + JSON.stringify(hits.slice(0, 8).map(x => ({ at: x.created_at || x.occurred_at, who: x.actor_name || x.actor_email || x.user_name || (x.actor && (x.actor.name || x.actor.email)), act: x.action || x.event_type, ent: x.entity_type || x.resource_type, sum: String(x.summary || x.description || JSON.stringify(x.changes || x.diff || '')).slice(0, 200) })));
  if (hits.length) break;
}
return fin({ out });
