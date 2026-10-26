await page.keyboard.press('Escape'); await sleep(500);
const out = {};
const r = await api('GET', '/audit/logs?limit=200'); out.api = r.s; const items = arr(r.j?.data); out.n = items.length;
out.entityTypes = [...new Set(items.map(x => x.entity_type || x.entityType))].slice(0, 30);
const t = await txt(); out.rawInFeed = (t.match(/audit\.[a-z_.]+/g) || []).slice(0, 10); out.lines = t.split('\n').filter(l => /restored|deleted|created|updated/i.test(l)).slice(0, 12);
await shot('1344-02-feed');
return done(out);
