// selection kept from previous run
const n0 = NET.length; await page.locator('main').getByRole('button', { name: 'Close', exact: true }).click(); await sleep(2000);
const cd = page.locator('[role=alertdialog], [role=dialog]').last(); out.conf = (await cd.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
if (out.conf) await cd.getByRole('button', { name: /Close/ }).last().click().catch(e => out.cErr = e.message.slice(0, 60)); await sleep(5000);
out.net = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 150));
await shot('w5/W5-44-closed');
await go('/settings/data/bulk-actions', 10000);
out.log = (await page.locator('body').innerText()).replace(/\s+/g, ' ').replace(/.*Failed Status /, '').slice(0, 300); await shot('w5/W5-44-log');
return fin({ out });
