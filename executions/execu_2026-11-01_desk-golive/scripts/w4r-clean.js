const ids = ['f642b146-8c00-4e6e-8b89-82bb5def710d', '2a0800d4-1273-4242-ab9f-c1de6f5891a6', 'e8078dcb-0ab6-45c7-8b19-8bc0ac8395c1'];
const cs = arr(D((await api('GET', '/modules/' + TM + '/records?limit=10&q=' + encodeURIComponent('QA GL W4R rating Customer'))).j)).map(flat).filter(t => /^QA GL W4R/.test(t.subject)); for (const t of cs) ids.push(t.id);
out.n = ids.length; out.del = []; for (const id of ids) out.del.push((await api('DELETE', '/modules/' + TM + '/records/' + id)).s);
await sleep(3000);
let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) { const b = await api('GET', '/audit/recycle-bin/items' + q); items = items.concat(arr(D(b.j))); }
const seen = new Set(); items = items.filter(x => !seen.has(x.id) && seen.add(x.id));
const pick = items.filter(x => ids.includes(x.record_id)); out.labels = pick.map(x => x.record_label);
if (pick.length) out.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) })).s + ' ' + pick.length;
out.left = arr(D((await api('GET', '/modules/' + TM + '/records?limit=20&q=' + encodeURIComponent('QA GL W4R'))).j)).map(flat).filter(t => /QA GL W4R/.test(t.subject)).length;
out.happy = (x => [x.is_enabled, x.department_scope_enabled])(D((await api('GET', '/desk/happiness/settings')).j));
return fin({ out });
