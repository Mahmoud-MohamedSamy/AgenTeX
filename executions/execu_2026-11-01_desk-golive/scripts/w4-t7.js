const out = {};
const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.t.slice(0, 260));
const ID0 = 0;
let r = await api('POST', '/desk/email-templates', { name: 'QA GL W4 reply ack', module: 'desk_tickets', notification_type: 'contact', department_id: '2a73bbc0-efb3-4250-bf9b-2fdc98236794', use_case: 'ticket.reply_acknowledgement', subject: 'QA GL W4 we got your reply [#{{ticket.number}}]', body_html: '<p>QA GL W4: thanks {{customer.name}}, we got your reply on {{ticket.number}}.</p>' }); if (r.j && r.j.data) CREATED.push({ kind: 'email-template', id: r.j.data.id, name: r.j.data.name });
out.put = r.s + ' ' + r.t.slice(0, 250);
await go('/settings/organization/email-templates', 10000);
const row = page.locator('tr').filter({ hasText: 'QA GL W4 reply ack' }).first();
await row.getByRole('button', { name: /^Actions for/ }).click(); await sleep(1000);
let n0 = NET.length;
await page.getByRole('menuitem', { name: /^Activate/ }).click(); await sleep(2000);
const d = page.locator('[role=dialog],[role=alertdialog]').last(); if (await d.count()) { out.actDlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500); await d.getByRole('button', { name: /^Activate/ }).last().click().catch(() => {}); await sleep(3000); }
out.actNet = nn(n0);
const list = D((await api('GET', '/desk/email-templates?limit=200&use_case=ticket.reply_acknowledgement')).j).email_templates; out.ack = list.map(x => x.name + ' / ' + (x.department_name || 'All') + ' / active=' + x.is_active);
// W4-29 delete while active
await go('/settings/organization/email-templates', 10000);
const row2 = page.locator('tr').filter({ hasText: 'QA GL W4 reply ack' }).first();
await row2.getByRole('button', { name: /^Actions for/ }).click(); await sleep(1000);
n0 = NET.length;
await page.getByRole('menuitem', { name: /^Delete/ }).click(); await sleep(2000);
const d2 = page.locator('[role=dialog],[role=alertdialog]').last(); out.delDlg = (await d2.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); await shot('w4/W4-29-delete-active');
await d2.getByRole('button', { name: /^Cancel/ }).click().catch(() => {}); await sleep(1000);
out.delNet = nn(n0);
return fin({ out });
