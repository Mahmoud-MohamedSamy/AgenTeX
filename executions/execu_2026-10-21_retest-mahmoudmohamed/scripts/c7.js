const items = []; let cur = null; for (let i = 0; i < 10; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=desk&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); items.push(...arr(r.j?.data)); cur = r.j?.meta?.next_cursor; if (!cur) break; }
const mine = items.filter(x => /QA RT|qa_rt/.test((x.record_label || '') + ' ' + (x.module_key || '')));
const r = mine.length ? await api('POST', '/audit/recycle-bin/delete', { ids: mine.map(x => x.id).slice(0, 25) }) : null;
const s = r ? JSON.parse(r.t) : null;
return { found: mine.length, succeeded: s?.data?.succeeded?.length, failed: s?.data?.failed?.length, reason: s?.data?.failed?.[0]?.reason_key, sample: mine.slice(0, 3).map(x => x.module_key + ':' + x.record_label + ' expires ' + (x.expires_at || '').slice(0, 10)) };
