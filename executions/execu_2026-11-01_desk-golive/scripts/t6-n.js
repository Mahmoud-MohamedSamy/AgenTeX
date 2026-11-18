NET.length = 0; await clickItem('Not Spam'); await sleep(1500); out.notspam = { dlg: await dlg(), toast: await toasts(), net: flt() };
// Archive open ticket T2
NET.length = 0; await clickItem('Archive'); out.archDlg = await dlg(); const cb = page.locator('[role=dialog],[role=alertdialog]').last().getByRole('button', { name: /archive/i }); if (await cb.count()) { await cb.last().click(); await sleep(3500); }
out.arch = { toast: await toasts(), url: page.url().replace(H, ''), net: flt() }; await shot('tm/tavi-archive-done');
let m = await openMore(); out.menuAfterArch = await m.getByRole('menuitem').allInnerTexts(); await page.keyboard.press('Escape');
// Follow: followers endpoints
for (const p of ['/desk/tickets/' + T2 + '/followers', '/desk/tickets/' + T1 + '/followers', '/desk/tickets/' + T2 + '/follow']) out['GET ' + p.slice(-30)] = (await (async () => { const r = await api('GET', p); return r.s + ' ' + r.t.slice(0, 200); })());
return fin({ out });
