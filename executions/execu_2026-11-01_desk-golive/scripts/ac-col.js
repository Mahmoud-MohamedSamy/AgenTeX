await go('/views/all/tickets/' + TK.CSU, 9000); out.t0 = (await head()).slice(0, 200); await shot('access/c-csu-open');
out.snaps = []; for (let i = 0; i < 9; i++) { await sleep(10000); out.snaps.push(((await toasts()) + ' || ' + (await dlg()) + ' || ' + (await head()).slice(0, 160)).slice(0, 400)); }
await shot('access/c-csu-after-move');
await page.getByRole('button', { name: /Reply|Comment/ }).first().click().catch(e => out.clickErr = String(e.message).slice(0, 80)); await sleep(3000); out.afterClick = (await toasts()) + ' || ' + (await head()).slice(0, 200); await shot('access/c-csu-after-click');
await page.reload(); await sleep(8000); out.reload = (await mtxt()).slice(0, 200); await shot('access/c-csu-reload');
out.api = await probe('CSU');
return fin({ out });
