const MI = '95a6fd64-b877-435e-8e23-62c75717f95f';
await go('/views/all/tickets/' + TK.R5, 9000); await clickItem('Move'); await sleep(1500);
const dl = page.locator('[role=dialog]').last();
await dl.getByRole('button', { name: 'Department' }).click(); await sleep(1500);
out.list = (await page.locator('[role=listbox],[role=menu],[cmdk-list],[data-radix-popper-content-wrapper]').last().innerText().catch(() => '')).replace(/\s+/g, ' | ').slice(0, 300);
await page.getByText('QA NDC Manual Invoice', { exact: true }).last().click(); await sleep(2500);
out.d2 = await dlg(); await shot('access/c-move-layout-1');
await dl.getByRole('button', { name: /^Move$/ }).click(); await sleep(4000);
out.d3 = await dlg(); out.toast = await toasts(); await shot('access/c-move-layout-2');
if (/layout/i.test(out.d3 || '')) { const b = page.locator('[role=dialog]').last().getByRole('button', { name: /Move|Continue|Save|Confirm|Apply/ }); await b.last().click().catch(() => {}); await sleep(4000); out.d4 = await dlg(); out.toast2 = await toasts(); await shot('access/c-move-layout-3'); }
const r = await api('GET', '/modules/' + TM + '/records/' + TK.R5); const rec = D(r.j); out.after = r.s + ' ' + (rec ? [flat(rec).department === MI ? 'ManualInvoice' : flat(rec).department, rec.layout_id || '', rec.created_with_layout_id].join(' | ') : '');
return fin({ out });
