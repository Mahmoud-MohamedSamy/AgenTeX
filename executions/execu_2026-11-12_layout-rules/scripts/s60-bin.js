const mid = await modId(); const out = {}; const r = await api('GET', '/audit/recycle-bin/items?limit=100'); const items = arr(r.j && (r.j.data && (r.j.data.items || r.j.data)));
out.n = items.length; out.keys = items[0] ? Object.keys(items[0]).join(',') : ''; out.mine = items.filter(i => /qa_lr|QA LR1112/i.test(JSON.stringify(i))).map(i => JSON.stringify(i).slice(0, 300));
return out;
