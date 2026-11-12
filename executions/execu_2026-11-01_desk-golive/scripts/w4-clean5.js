await go('/settings/organization/email-templates', 10000);
const row = page.locator('tr').filter({ hasText: 'QA GL W4 reply ack' }).first();
await row.getByRole('button', { name: /^Actions for/ }).click(); await sleep(1500);
out.menu = (await page.locator('[role=menu]').last().innerText()).replace(/\s+/g, ' ');
const n0 = NET.length;
const mi = page.getByRole('menuitem', { name: /Deactivate|Use built-in|Stop/i }).first();
if (await mi.count()) { await mi.click(); await sleep(2000); const d = page.locator('[role=dialog],[role=alertdialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await d.getByRole('button', { name: /Deactivate|Confirm|Yes|Use/i }).last().click().catch(() => {}); await sleep(3000); } }
out.net = NET.slice(n0).filter(x => x.m !== 'GET' && !/heartbeat|resolved|realtime/.test(x.u)).map(x => x.m + ' ' + x.u.split('/').slice(-2).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 120));
const d2 = await api('DELETE', '/desk/email-templates/0f472a78-e303-4644-9cd7-ef35c013382d'); out.del = d2.s + ' ' + d2.t.slice(0, 120);
return fin({ out });
