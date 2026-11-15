const ID = '0f472a78-e303-4644-9cd7-ef35c013382d', MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794';
let list = D((await api('GET', '/desk/email-templates?limit=200&use_case=ticket.reply_acknowledgement')).j).email_templates;
out.before = list.map(x => [x.id.slice(0, 12), x.name, x.department_id ? x.department_id.slice(0, 8) : 'All', x.is_active, !!(x.is_system || x.system)]);
await go('/settings/organization/email-templates', 10000);
const row = page.locator('tr').filter({ hasText: 'QA GL W4 reply ack' }).first();
out.rowTxt = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
await row.getByRole('button', { name: /^Actions for/ }).click().catch(e => out.e1 = e.message.slice(0, 80)); await sleep(1500);
out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
await shot('w4/r-tpl-menu');
const n0 = NET.length;
const mi = page.getByRole('menuitem', { name: /Deactivate|built-in|Stop using|Use default/i }).first();
if (await mi.count()) { out.clicked = await mi.innerText(); await mi.click(); await sleep(2000); const d = page.locator('[role=dialog],[role=alertdialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await d.getByRole('button', { name: /Deactivate|Confirm|Yes|Use|Switch/i }).last().click().catch(() => {}); await sleep(3000); } }
else await page.keyboard.press('Escape');
out.net = NET.slice(n0).filter(x => x.m !== 'GET' && !/heartbeat|resolved|realtime/.test(x.u)).map(x => x.m + ' ' + x.u.split('/').slice(-2).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 120));
list = D((await api('GET', '/desk/email-templates?limit=200&use_case=ticket.reply_acknowledgement')).j).email_templates;
out.after = list.map(x => [x.name, x.department_id ? x.department_id.slice(0, 8) : 'All', x.is_active]);
await go('/settings/channels/email/domains', 10000); out.domPage = (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 700); await shot('w4/r-domains');
return fin({ out });
