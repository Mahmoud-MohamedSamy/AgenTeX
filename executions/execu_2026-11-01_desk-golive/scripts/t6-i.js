const T3 = 'f0de42fe-d7da-46a0-b75e-2b8abeceee37', T4 = '6ff392af-b0c0-4678-a701-d78f5100a0af';
await go('/views/all/merge?ids=' + T3 + '%2C' + T4, 9000); NET.length = 0;
await page.getByRole('button', { name: 'Merge', exact: true }).first().click(); await sleep(2000);
await page.getByRole('button', { name: 'Yes, Merge' }).click(); await sleep(5000);
out.merge = { toast: await toasts(), url: page.url().replace(H, ''), net: NET.filter(n => !/heartbeat|summaries|realtime|resolved-batch|\/read$/.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u + ' ' + n.t.slice(0, 200)) };
await shot('tm/tavi-merge-done');
out.t4 = JSON.stringify(await get(TM, T4)).slice(0, 600);
await go('/views/all/tickets/' + T4, 9000); out.t4page = (await head()).slice(0, 400); await shot('tm/tavi-merge-child');
return fin({ out });
