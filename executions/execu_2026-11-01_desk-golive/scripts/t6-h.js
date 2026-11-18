const T3 = 'f0de42fe-d7da-46a0-b75e-2b8abeceee37', T4 = '6ff392af-b0c0-4678-a701-d78f5100a0af';
NET.length = 0;
await page.getByRole('button', { name: 'Merge', exact: true }).first().click(); await sleep(2500);
out.mergeConfirm = await dlg(); await shot('tm/tavi-merge-3');
const cb = page.locator('[role=dialog],[role=alertdialog]').last().getByRole('button', { name: /^Merge/ }); if (await cb.count()) { await cb.first().click(); await sleep(4000); }
out.merge = { toast: await toasts(), url: page.url().replace(H, ''), net: NET.filter(n => !/heartbeat|summaries|realtime|resolved-batch|\/read$/.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u + ' ' + n.t.slice(0, 200)) };
out.t4 = JSON.stringify(await get(TM, T4)).slice(0, 500); await shot('tm/tavi-merge-done');
// Move
await go('/views/all/tickets/' + T1, 9000); NET.length = 0;
await clickItem('Move'); const d = page.locator('[role=dialog]').last();
await d.getByText('Choose a department').first().click(); await sleep(1200);
out.moveOpts = (await page.locator('[role=listbox],[role=option],[role=menu]').allInnerTexts()).join(' | ').replace(/\s+/g, ' ').slice(0, 400);
await page.getByRole('option', { name: /Customer Support/ }).first().click().catch(e => out.optErr = e.message.slice(0, 120)); await sleep(1500);
out.moveDlg = await dlg(); await shot('tm/tavi-move-dlg');
await d.getByRole('button', { name: 'Move', exact: true }).click().catch(e => out.mvErr = e.message.slice(0, 120)); await sleep(4000);
out.move = { toast: await toasts(), url: page.url().replace(H, ''), net: NET.filter(n => !/heartbeat|summaries|realtime|resolved-batch|\/read$/.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u + ' ' + n.b.slice(0, 120) + ' => ' + n.t.slice(0, 160)) };
out.t1 = JSON.stringify(await get(TM, T1)).slice(0, 500); await shot('tm/tavi-move-done');
return fin({ out });
