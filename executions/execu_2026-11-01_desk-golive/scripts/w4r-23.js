const ID = '684a13c3-f3eb-498f-b6dd-90fd3cfd6057';
out.del = (await api('DELETE', '/modules/' + TM + '/records/' + ID)).s; await sleep(3000);
let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) { const b = await api('GET', '/audit/recycle-bin/items' + q); items = items.concat(arr(D(b.j))); }
const pick = items.filter(x => x.record_id === ID); out.labels = pick.map(x => x.record_label);
if (pick.length) out.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: [pick[0].id], ids: [pick[0].id] })).s;
out.get = (await api('GET', '/modules/' + TM + '/records/' + ID)).s;
out.blockList = arr(D((await api('GET', '/desk/channels/spam-contacts?limit=200')).j)).filter(x => /mmohamed@anyware|mahmoud\.mmohamedsamy@gmail/.test(x.address)).length;
return fin({ out });
