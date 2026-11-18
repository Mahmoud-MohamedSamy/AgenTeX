await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: H });
await go('/views/all/tickets/' + T1, 9000);
NET.length = 0;
await clickItem('Mark as Unread'); out.unread = { toast: await toasts(), url: page.url().replace(H, ''), net: NET.filter(n => !/heartbeat|summaries|realtime|resolved-batch/.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u) };
await shot('tm/tavi-unread');
const card = page.locator('a,div').filter({ hasText: /^QA GL TM menu 1/ }).first(); out.unreadCard = await card.evaluate(e => e.outerHTML.slice(0, 600)).catch(() => 'no card');
if (!page.url().includes(T1)) await go('/views/all/tickets/' + T1, 8000);
for (const it of ['Copy link', 'Copy rating link']) { await page.evaluate(() => navigator.clipboard.writeText('EMPTY')).catch(() => {}); NET.length = 0; await clickItem(it);
  out[it] = { toast: await toasts(), clip: await page.evaluate(() => navigator.clipboard.readText()).catch(e => 'ERR ' + e.message), net: NET.filter(n => !/heartbeat|summaries|realtime|resolved-batch/.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u + ' ' + n.t.slice(0, 150)) }; await shot('tm/tavi-' + it.replace(/\s+/g, '-')); }
for (const it of ['Recalculate Skills', 'Assign by Skills']) { NET.length = 0; await clickItem(it); await sleep(1500);
  out[it] = { toast: await toasts(), dlg: await dlg(), net: NET.filter(n => !/heartbeat|summaries|realtime|resolved-batch/.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u + ' ' + n.t.slice(0, 200)) }; await shot('tm/tavi-' + it.replace(/\s+/g, '-')); await page.keyboard.press('Escape'); }
return fin({ out });
