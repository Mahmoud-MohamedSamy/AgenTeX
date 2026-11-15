const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {}; R.net = [];
page.on('response', r => { const u = r.url(); if (/\/layouts\//.test(u) && r.request().method() !== 'GET') R.net.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(/^https:\/\/[^/]+/, '')); });
await page.goto(H + '/settings/modules-and-fields/' + MID + '?tab=layouts', { waitUntil: 'domcontentloaded' }); await sleep(7000);
await page.getByRole('button', { name: 'Open menu for QA RT18 J6b Layout' }).click(); await sleep(1200);
R.popup = (await page.locator('[role=menu],[data-radix-popper-content-wrapper],[role=listbox]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
await shot('3015-2-menu.png');
const del = page.getByText(/^Delete( layout)?$/i).last(); R.hasDel = await del.count();
if (R.hasDel) { await del.click(); await sleep(2500); R.dialog = (await page.locator('[role=alertdialog],[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 700); await shot('3015-3-delete-dialog.png'); }
return R;
