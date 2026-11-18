let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) items = items.concat(arr(D((await api('GET', '/audit/recycle-bin/items' + q)).j)));
const it = items.find(x => x.record_id === T1); out.bin = it ? it.record_label : 'not in bin';
if (it) out.restore = (await api('POST', '/audit/recycle-bin/restore', { item_ids: [it.id], ids: [it.id] })).s;
await sleep(2000); out.get = JSON.stringify(await get(TM, T1)).slice(0, 300);
out.holds = JSON.stringify(arr(D((await api('GET', '/desk/legal-holds?limit=100')).j)).filter(h => h.record_id === T1).map(h => [h.id, h.reason]));
// Spam / not spam on T2
await go('/views/all/tickets/' + T2, 9000); NET.length = 0; await clickItem('Mark as Spam'); out.spamDlg = await dlg();
const cb = page.locator('[role=dialog],[role=alertdialog]').last().getByRole('button', { name: /spam/i }); if (await cb.count()) { await cb.last().click(); await sleep(3500); }
out.spam = { toast: await toasts(), url: page.url().replace(H, ''), net: flt() }; out.spamHead = (await head()).slice(0, 300); await shot('tm/tavi-spam-done');
let m = await openMore(); out.menuAfterSpam = await m.getByRole('menuitem').allInnerTexts(); await page.keyboard.press('Escape');
return fin({ out });
