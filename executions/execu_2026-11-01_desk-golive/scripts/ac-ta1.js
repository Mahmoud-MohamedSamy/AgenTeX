await go('/settings/users-control/ticket-access', 9000);
await page.getByText('Public Read Only', { exact: true }).first().click(); await sleep(1000);
await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(4000);
out.toast = await toasts(); out.net = NET.filter(n => !/iam\/|auth|notif|resolved|presence|heartbeat/.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u + ' ' + n.b.slice(0, 200) + ' => ' + n.t.slice(0, 200));
await shot('access/ta-publicRO');
return fin({ out });
