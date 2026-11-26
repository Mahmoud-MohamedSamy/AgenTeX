const T0 = '2026-11-24T11:36:00';
const all = []; let cur = '';
for (let i = 0; i < 6; i++) { const r = await api('GET', '/agents/tia/conversations?limit=50' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = arr(r.j?.data); all.push(...d); cur = r.j?.meta?.next_cursor || ''; if (!cur || !d.length) break; }
const mine = all.filter(c => (c.updated_at || '') >= T0);
const del = []; for (const c of mine) { if (String(c.id).startsWith('e282805d')) continue; const r = await api('DELETE', `/agents/tia/conversations/${c.id}`); del.push(r.s); }
return { who: process.env.WHO, app: process.env.APP, total: all.length, deleted: del, keptOlder: all.length - mine.length, sampleKeys: Object.keys(all[0] || {}).slice(0, 10) };
