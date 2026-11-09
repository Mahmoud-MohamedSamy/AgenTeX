const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 140)) : undefined });
const D = '/desk/departments'; const id = '0d3c1585-5df2-40c2-894c-752cbdaead08'; const o = {};
const g0 = (await api('GET', D + '/' + id)).j.data; o.before = { cc: g0.cc_enabled, sendAs: g0.send_as_email_enabled, sched: g0.scheduled_replies_enabled, mass: g0.mass_comments_enabled };
const body = x => ({ name: x.name, description: x.description, visibility: x.visibility, help_center_display_name: x.help_center_display_name, cc_enabled: x.cc_enabled, auto_private_non_contacts: x.auto_private_non_contacts, send_as_email_enabled: x.send_as_email_enabled, mass_comments_enabled: x.mass_comments_enabled, scheduled_replies_enabled: x.scheduled_replies_enabled, scheduled_reply_cancel_on_customer_reply: x.scheduled_reply_cancel_on_customer_reply, scheduled_reply_cancel_on_close: x.scheduled_reply_cancel_on_close, routing_strategy: x.routing_strategy, logo_file_id: x.logo_file_id });
let r = await api('PATCH', D + '/' + id, { ...body(g0), cc_enabled: !g0.cc_enabled, send_as_email_enabled: !g0.send_as_email_enabled, mass_comments_enabled: !g0.mass_comments_enabled, help_center_display_name: 'QA GL Help name', visibility: 'public' });
const a = (await api('GET', D + '/' + id)).j.data;
o.W1_22 = { ...S(r), cc: a.cc_enabled, sendAs: a.send_as_email_enabled, mass: a.mass_comments_enabled, hc: a.help_center_display_name, vis: a.visibility };
// stale two-tab write: both based on g0
const c1 = await api('PATCH', D + '/' + id, { ...body(g0), description: 'QA GL tab A' });
const c2 = await api('PATCH', D + '/' + id, { ...body(g0), description: 'QA GL tab B' });
const f = (await api('GET', D + '/' + id)).j.data;
o.W1_27 = { tabA: S(c1), tabB: S(c2), final: f.description, ccAfterStale: f.cc_enabled, hcAfterStale: f.help_center_display_name, note: 'tab B was built from data read before the W1_22 save' };
// UI form check
await go('/settings/organization/departments', 15000); const t = await txt();
o.ui = { listHasQA: t.includes('QA GL Dept'), cols: ['NAME', 'Help Center Display Name', 'TYPE', 'CREATED', 'STATUS'].filter(c => t.includes(c)).length, defaultBadge: /Default/.test(t), raw: (t.match(/\b[a-z]+\.[a-z]+\.[a-zA-Z]+\b/g) || []).slice(0, 5) };
await go('/settings/organization/departments/' + id, 15000); const t2 = await txt();
o.ui.form = ['Department Name', 'Display Name in Help Center', 'Logo', 'Associate Agents', 'Allow copied addresses', 'Send as Email', 'schedule replies'].map(s => s + ':' + t2.includes(s)).join(' ');
return done(o);
