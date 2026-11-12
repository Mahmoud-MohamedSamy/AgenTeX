const b = await api('GET', '/audit/recycle-bin/items?limit=200&app=desk');
const pick = arr(b.j && b.j.data).filter(x => x.record_id === '7bc907e3-7066-4e33-b1b6-3637c9dd193f' && x.record_label === 'QA GL W2 view');
const o = { n: pick.length }; if (pick.length) o.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) })).s;
const b2 = await api('GET', '/audit/recycle-bin/items?limit=200&app=desk'); o.left = arr(b2.j && b2.j.data).filter(x => /QA GL W2/.test(x.record_label || '')).length; return done(o);
