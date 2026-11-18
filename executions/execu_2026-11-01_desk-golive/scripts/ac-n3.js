await go('/settings/customization/notifications', 10000); const t = await mtxt(); const i = t.indexOf('Notification rules');
out.sections = (t.slice(i).match(/[A-Z][a-z]+ Notifications/g) || []).join(' | ');
out.shared = /shar/i.test(t.slice(i)); out.moved = /moved/i.test(t.slice(i));
out.rules = (t.slice(i).match(/(Receiving|Assigning|Adding|Creating|Moving|Sharing)[a-z ]{3,40}/g) || []).slice(0, 60).join(' | ');
const s = page.getByText(/Agent Notifications|Department Notifications/).first(); if (await s.count()) { await s.scrollIntoViewIfNeeded(); await sleep(800); }
await shot('access/o-notifications-agent');
return fin({ out });
