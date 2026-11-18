const t = await mk(TM, 'ticket', 'QA GL TM follow', { subject: 'QA GL TM follow', department: MK, status: 'Open', email: 'qa-gl-tm-c1@example.com' }); const id = t.id; out.id = id;
await go('/views/all/tickets/' + id, 9000);
let m = await openMore(); out.followRole = await m.getByText('Follow', { exact: true }).evaluate(e => { const x = e.closest('[role]'); return x ? x.getAttribute('role') : 'none'; });
NET.length = 0; await m.getByText('Follow', { exact: true }).click(); await sleep(3000);
out.follow = { toast: await toasts(), net: flt() };
out.followers = JSON.stringify(D((await api('GET', '/desk/tickets/' + id + '/followers')).j)).slice(0, 200);
m = await openMore(); out.menuText = (await m.innerText()).replace(/\s+/g, ' '); await shot('tm/tavi-follow-menu');
const uf = m.getByText(/Unfollow/i).first(); if (await uf.count()) { NET.length = 0; await uf.click(); await sleep(3000); out.unfollow = { toast: await toasts(), net: flt() }; }
out.followers2 = JSON.stringify(D((await api('GET', '/desk/tickets/' + id + '/followers')).j)).slice(0, 100);
out.del = (await api('DELETE', '/modules/' + TM + '/records/' + id)).s; await sleep(2500);
let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) items = items.concat(arr(D((await api('GET', '/audit/recycle-bin/items' + q)).j)));
const it = items.find(x => x.record_id === id && /QA GL TM follow/.test(x.record_label || '')); if (it) out.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: [it.id], ids: [it.id] })).s;
out.get = (await api('GET', '/modules/' + TM + '/records/' + id)).s;
return fin({ out });
