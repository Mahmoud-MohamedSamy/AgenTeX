const gone = JSON.parse(fs.readFileSync(RUN + '/out/cleanup-desk-gone.json', 'utf8')); const ids = new Set(gone.map(g => g[1])); 
const out = { other: [] }; const pick = []; let cursor = null;
for (const app of ['desk']) { cursor = null; for (let p = 0; p < 40; p++) { const r = await api('GET', '/audit/recycle-bin/items?' + (app ? 'app_key=' + app + '&' : '') + 'limit=100' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); for (const i of arr(r.j.data && (r.j.data.items || r.j.data))) { if (!/QA LR1112|qa_lr/i.test(i.record_label || '')) continue; if ((ids.has(i.record_id) || /^QA LR1112/.test(i.record_label)) && !pick.find(x => x.id === i.id)) pick.push(i); else if (!ids.has(i.record_id)) out.other.push(i.app_key + ' ' + i.module_key + ' ' + i.record_label); } cursor = r.j.meta && (r.j.meta.next_cursor || r.j.meta.nextCursor); if (!cursor) break; } }
out.pick = pick.map(i => i.module_key + ':' + i.record_label);
if (pick.length) out.purge = SR(await api('POST', '/audit/recycle-bin/delete', { ids: pick.map(i => i.id) }));
return out;
