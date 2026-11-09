const n = await call('GET', '/notifications?limit=50');
const items = (n.j.data && (n.j.data.data || n.j.data.items)) || [];
const mine = items.filter(x => /crm\.activity|reminder/.test(x.event_type) || /QA W4/.test(JSON.stringify(x)));
const t = await call('GET', `/modules/${MODS.tasks}/records/f8ad6687-3c73-4cd9-815a-ba8ac23dec4a`);
const v = k => { const f = t.j.data.data.find(e => e.field === k); return f && f.value && f.value.value; };
return { now: new Date().toISOString(), reminders: mine.map(x => x.event_type + ' | ' + x.title + ' | ' + x.created_at), task: { due: v('due_date'), rem: v('reminder_offset_minutes'), related: JSON.stringify(t.j.data.data.find(e => e.field === 'related_to')) } };
