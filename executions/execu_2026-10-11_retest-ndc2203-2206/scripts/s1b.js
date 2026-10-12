const off = capOn(); const out = {};
await go('/tags', 15000);
const t = await txt(); out.t = t.slice(t.indexOf('Scheduled Replies') + 17).slice(0, 1000);
await shot('x-tags');
out.calls = cap.filter(c => !/iam\/me|nav_tabs|crm\/status|send-as-email|settings\/hub|resolved/.test(c));
off(); return done(out);
