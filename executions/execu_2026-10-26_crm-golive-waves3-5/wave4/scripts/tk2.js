const g = await call('GET', `/modules/${MODS.tasks}/records/e317b07b-d193-42af-803a-62c16b8f6ccc`);
const r = await call('GET', `/modules/${MODS.tasks}/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc`);
const q = (r.j.data || []).filter(x => /QA W4/.test(JSON.stringify(x))).map(x => x.id + ' ' + x.layout_id);
const s = await call('GET', '/search?q=' + encodeURIComponent('QA W4 Reminder task UI') + '&limit=5');
return { get: g.s + ' ' + g.t.slice(0, 200), listQA: q, search: s.s + ' ' + s.t.slice(0, 300) };
