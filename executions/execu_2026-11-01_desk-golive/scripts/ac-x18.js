await go('/settings/data/export', 8000);
await page.getByText('Choose a module', { exact: true }).first().click(); await sleep(1500);
await page.getByRole('option', { name: /^Tickets$/ }).first().click().catch(async () => { await page.getByText('Tickets', { exact: true }).last().click(); }); await sleep(2000);
await page.locator('main').last().getByRole('button', { name: /^Export$/ }).last().click(); await sleep(8000);
out.toast = await toasts(); out.net = NET.filter(n => /export/i.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u + ' ' + n.b.slice(0, 200) + ' => ' + n.t.slice(0, 300));
await shot('access/b-export-run');
return fin({ out });
