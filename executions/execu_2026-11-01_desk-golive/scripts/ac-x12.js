const MI = '95a6fd64-b877-435e-8e23-62c75717f95f';
const rec0 = D((await api('GET', '/modules/' + TM + '/records/' + TK.R5)).j); out.layoutBefore = rec0.layout_id || rec0.created_with_layout_id;
await go('/views/all/tickets/' + TK.R5, 9000); await clickItem('Move'); await sleep(1500); out.d1 = await dlg();
const cb = page.locator('[role=dialog]').last().getByRole('combobox').first(); await cb.click().catch(() => {}); await sleep(1200);
await page.getByRole('option', { name: /Manual Invoice/ }).first().click().catch(e => out.e1 = String(e.message).slice(0, 80)); await sleep(2500);
out.d2 = await dlg(); await shot('access/c-move-layout-1');
await page.locator('[role=dialog]').last().getByRole('button', { name: /^Move$/ }).click().catch(e => out.e2 = String(e.message).slice(0, 80)); await sleep(4000);
out.d3 = await dlg(); out.toast = await toasts(); await shot('access/c-move-layout-2');
const nx = page.locator('[role=dialog]').last().getByRole('button', { name: /Move|Continue|Save|Confirm/ }); if (out.d3 && await nx.count()) { await nx.last().click().catch(() => {}); await sleep(4000); out.d4 = await dlg(); out.toast2 = await toasts(); }
const rec = D((await api('GET', '/modules/' + TM + '/records/' + TK.R5)).j); out.after = rec ? [flat(rec).department === MI ? 'MI' : flat(rec).department, rec.layout_id || rec.created_with_layout_id].join(' | ') : 'no access';
return fin({ out });
