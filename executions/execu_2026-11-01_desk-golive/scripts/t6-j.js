await go('/views/all/tickets/' + T1, 9000);
NET.length = 0; await clickItem('Share'); let d = page.locator('[role=dialog]').last();
await d.getByText('Add department').first().click(); await sleep(1000);
const trig = d.getByText('Choose a department', { exact: true }).last(); out.trigTag = await trig.evaluate(e => e.tagName + ' ' + (e.closest('button')?.outerHTML || '').slice(0, 200));
await (await trig.evaluate(e => !!e.closest('button')) ? d.locator('button').filter({ hasText: 'Choose a department' }).last() : trig).click(); await sleep(1200);
out.pop = (await page.locator('[role=listbox],[role=menu],[data-radix-popper-content-wrapper],[cmdk-list]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await shot('tm/tavi-share-pop');
const hr = page.locator('[role=option],[role=menuitem],[cmdk-item],li,button').filter({ hasText: /^HR$/ }).first(); out.hr = await hr.count(); if (out.hr) { await hr.click(); await sleep(800); }
out.shareDlg = await dlg();
if (out.hr) { await d.getByRole('button', { name: 'Save' }).click(); await sleep(3500); }
out.share = { toast: await toasts(), net: flt() }; out.shareBanner = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').match(/.{0,60}[Ss]hared.{0,100}/)?.[0] || 'no shared text'; await shot('tm/tavi-share-done');
return fin({ out });
