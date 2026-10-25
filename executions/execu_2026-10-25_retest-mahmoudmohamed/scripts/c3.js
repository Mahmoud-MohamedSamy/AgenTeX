// Purge QA RT items from the Recycle Bin, then verify none remain.
const list = async () => { const all = []; let cur = ''; for (let i = 0; i < 40; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); const a = arr(r.j?.data); all.push(...a); cur = r.j?.meta?.next_cursor; if (!cur || !a.length) break; } return all; };
const before = (await list()).filter(x => /^QA RT|^qa rt|qa_rt/i.test(x.record_label || ''));
const res = {}; for (let i = 0; i < before.length; i += 25) { const r = await api('POST', '/audit/recycle-bin/delete', { ids: before.slice(i, i + 25).map(x => x.id) }); res[r.s] = (res[r.s] || 0) + 1; }
const after = (await list()).filter(x => /^QA RT|^qa rt|qa_rt/i.test(x.record_label || ''));
return done({ found: before.length, batches: res, remaining: after.length, remainingSample: after.slice(0, 5).map(x => x.record_label + ' ' + (x.app_key || '')) });
