const mid = await modId(); const o = {}; const tid = 'f3219575-2599-406a-a041-3d75589a6f96';
o.rule = I.g17 && (await delRule(mid, I.g17)).s; delete I.g17;
o.del = (await api('DELETE', '/modules/' + mid + '/records/' + tid)).s; await sleep(3000);
const b = await api('GET', '/audit/recycle-bin/items?limit=200'); const it = arr(b.j && b.j.data).filter(x => x.record_id === tid);
o.binLabels = it.map(x => x.record_label);
if (it.length) o.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: it.map(x => x.id), ids: it.map(x => x.id) })).s;
SAVE(); LED('G17 rule + ticket 3390 removed/purged'); return o;
