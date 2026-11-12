const me = D((await api('GET', '/iam/me')).j); out.me = me && (me.email || (me.user && me.user.email));
const et = await api('GET', '/desk/email-templates?limit=200'); const l = (D(et.j) || {}).email_templates || [];
out.tpl = et.s + ' n=' + l.length + ' qa=' + l.filter(x => /QA GL W4/.test(x.name)).map(x => x.name + '/' + x.folder_name).join(' ; ');
const fo = await api('GET', '/desk/email-templates/folders'); out.folders = fo.s + ' ' + ((D(fo.j) || {}).folders || []).map(x => x.name + '/' + x.visibility).join(' ; ');
const g1 = await api('GET', '/desk/email-templates/9dfb198b-8f5c-4c38-9dcc-2a4d0ebdc34d'); out.direct = g1.s + ' ' + g1.t.slice(0, 120);
// W4-10/16/22/81 settings access for agent C
for (const p of ['/desk/channels/addresses', '/desk/channels/spam-contacts', '/mail/connections', '/web-forms', '/help-centers', '/desk/happiness/settings', '/desk/community/settings']) { const r = await api('GET', p); out['GET ' + p] = r.s + ' ' + (Array.isArray(D(r.j)) ? 'n=' + D(r.j).length : r.t.slice(0, 80)); }
let r = await api('POST', '/desk/channels/addresses', { local_part: 'qa-gl-w4-agent', department_id: '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158' }); out.postAddr = r.s + ' ' + r.t.slice(0, 150);
r = await api('POST', '/desk/channels/spam-contacts', { address: 'qa-gl-w4-agentc@example.com' }); out.postBlock = r.s + ' ' + r.t.slice(0, 150);
r = await api('POST', '/mail/connections/smtp', { host: 'smtp.invalid.example', port: 587, sending_domain: 'example.com' }); out.postSmtp = r.s + ' ' + r.t.slice(0, 150);
const pages = {};
for (const p of ['/settings/channels/email', '/settings/integrations', '/settings/channels/web-forms', '/settings/channels/help-center', '/settings/organization/email-templates', '/settings/organization/customer-happiness', '/settings/channels/community']) { await go(p, 9000); const t = (await txt()).replace(/\s+/g, ' '); pages[p] = page.url().replace(H, '') + ' :: ' + t.slice(-300); }
out.pages = pages; await shot('w4/W4-10-agentc-email');
return fin({ out });
