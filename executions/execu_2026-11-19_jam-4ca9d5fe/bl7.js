const D = '19510fdc-91f3-4a7a-8888-153f1318b765';
const r = await api('GET', '/audit/events?limit=200'); const ev = r.j?.data || []; log({ n: ev.length, keys: Object.keys(ev[0] || {}), meta: r.j?.meta });
const rel = ev.filter(e => JSON.stringify(e).includes(D) || /QA BL|Round Robin_Sequential/.test(JSON.stringify(e)));
log(rel.slice(0, 40).map(e => ({ at: e.occurred_at?.slice(11, 19), day: e.occurred_at?.slice(0, 10), action: e.action || e.event_type, entity: e.entity_type || e.resource_type, actor: e.actor_label || e.actor_id?.slice(0, 8), diff: JSON.stringify(e.changes || e.diff || e.payload || e.data || {}).slice(0, 600) })));
