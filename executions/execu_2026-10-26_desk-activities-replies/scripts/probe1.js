// Read-only: list modules (activity ones), activity endpoints, reply-related settings; find a ticket with replies
const out = {};
const short = r => ({ s: r.s, t: r.t.slice(0, 400) });
const ms = await mods(); out.modules = ms.filter(m => /task|call|event|ticket|contact|activit/i.test(m.moduleKey)).map(m => ({ id: m.id, key: m.moduleKey, name: m.pluralForm || m.labels }));
for (const p of ['/desk/activity-views', '/desk/activities/reminders/options', '/desk/activities/invited', '/desk/timers/current', '/desk/snippets', '/desk/ticket-statuses', '/desk/scheduled-replies', '/desk/tickets/summaries', '/desk/tickets?take=5', '/desk/tickets?limit=5',
  '/desk/activities', '/desk/activities?take=5', '/desk/activities/stats', '/desk/activities/reports', '/desk/activities/settings', '/desk/reply-settings', '/desk/tickets/reply-settings', '/desk/email/settings', '/desk/signatures', '/desk/my-signatures', '/desk/settings/replies'])
  out[p] = short(await api('GET', p));
return done(out);
