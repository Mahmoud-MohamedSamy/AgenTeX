out.purge = (await api('POST', '/audit/recycle-bin/delete', { ids: ['802cc27c-23ef-46d9-a65b-75a4c656efd6'] })).s;
let cur = null, qa = [];
for (let p = 0; p < 6; p++) { const b = await api('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = Array.isArray(b.j.data) ? b.j.data : (b.j.data.items || []); qa.push(...d.filter(i => JSON.stringify(i).includes('QA R2SC')).map(i => i.id)); cur = b.j.meta && b.j.meta.next_cursor; if (!cur || !d.length) break; }
out.binQALeft = qa;
