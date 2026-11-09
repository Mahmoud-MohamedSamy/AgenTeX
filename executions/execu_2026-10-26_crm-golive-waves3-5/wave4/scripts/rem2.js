const n = await call('GET', '/notifications?limit=50');
const items = (n.j.data && (n.j.data.data || n.j.data.items)) || [];
const crm = items.filter(x => /^crm\./.test(x.event_type)).slice(0, 10).map(x => x.event_type + ' | ' + x.title + ' | ' + x.created_at);
const rem = await call('GET', '/desk/activities/e317b07b-d193-42af-803a-62c16b8f6ccc/reminders');
const raw = n.s + ' ' + n.t.slice(0, 200);
return { raw, now: new Date().toISOString(), total: items.length, latestCrm: crm, latest3: items.slice(0, 3).map(x => x.event_type + ' ' + x.created_at), reminderRows: rem.s + ' ' + rem.t.slice(0, 300) };
