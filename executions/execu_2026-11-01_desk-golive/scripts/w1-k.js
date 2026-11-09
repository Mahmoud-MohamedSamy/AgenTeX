const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 140)) : undefined });
const D = '/desk/departments'; const o = {};
const c = await api('POST', D, { name: 'QA GL Dept LU', visibility: 'private' }); const id = c.j && c.j.data && c.j.data.id; o.create = S(c); o.id = id;
const body = x => ({ name: x.name, description: x.description, visibility: x.visibility, help_center_display_name: x.help_center_display_name, cc_enabled: x.cc_enabled, auto_private_non_contacts: x.auto_private_non_contacts, send_as_email_enabled: x.send_as_email_enabled, mass_comments_enabled: x.mass_comments_enabled, scheduled_replies_enabled: x.scheduled_replies_enabled, scheduled_reply_cancel_on_customer_reply: x.scheduled_reply_cancel_on_customer_reply, scheduled_reply_cancel_on_close: x.scheduled_reply_cancel_on_close, routing_strategy: x.routing_strategy, logo_file_id: x.logo_file_id });
const tabA = (await api('GET', D + '/' + id)).j.data; const tabB = JSON.parse(JSON.stringify(tabA)); // both tabs open the form
const a = await api('PATCH', D + '/' + id, { ...body(tabA), cc_enabled: false });           // tab A turns CC off and saves
const mid = (await api('GET', D + '/' + id)).j.data.cc_enabled;
const b = await api('PATCH', D + '/' + id, { ...body(tabB), description: 'QA GL changed in tab B' }); // tab B (stale) changes only the description
const f = (await api('GET', D + '/' + id)).j.data;
o.result = { tabA: S(a), ccAfterA: mid, tabB: S(b), ccFinal: f.cc_enabled, descFinal: f.description, versionFieldInGet: ['row_version', 'version', 'etag'].filter(k => k in tabA) };
o.cleanup = /^QA GL/.test(f.name) ? S(await api('DELETE', D + '/' + id)) : 'skip';
return done(o);
