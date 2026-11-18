const id = 'e8bd15e6-5ced-4047-8103-3aa83487626c';
out.del = (await api('DELETE', '/modules/' + TM + '/records/' + id)).s; await sleep(2500);
let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) items = items.concat(arr(D((await api('GET', '/audit/recycle-bin/items' + q)).j)));
const it = items.filter(x => /QA GL TM/.test(x.record_label || '')); out.binQA = it.map(x => x.record_label);
if (it.length) out.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: it.map(x => x.id), ids: it.map(x => x.id) })).s;
out.get = (await api('GET', '/modules/' + TM + '/records/' + id)).s; out.left = (await findT('QA GL TM')).length;
return fin({ out });
