await go('/settings/customization/notifications', 10000); const t = await mtxt(); const i = t.indexOf('Email Providers'); out.t = (i > 0 ? t.slice(i + 15) : t).slice(0, 3000); await shot('access/o-notifications');
out.hasShare = /shar/i.test(out.t);
// bell of C after shares
return fin({ out });
