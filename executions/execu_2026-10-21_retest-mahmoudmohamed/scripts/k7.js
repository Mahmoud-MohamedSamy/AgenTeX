let full = null; const f = r => { const u = r.url(); if (/\/audit\/events\?/.test(u)) full = decodeURIComponent(u.replace(H + '/api/v1', '')); }; page.on('request', f);
await page.reload({ waitUntil: 'commit' }); await sleep(9000); page.off('request', f);
const types = full ? [...full.matchAll(/entity_type=([^&]+)/g)].map(m => m[1]) : [];
const ev = await api('GET', '/audit/events?limit=200');
const items = arr(ev.j?.data);
const mine = items.filter(x => /pipeline|stage/i.test(JSON.stringify(x).slice(0, 2000))).slice(0, 10).map(x => JSON.stringify(x).slice(0, 300));
const et = {}; for (const x of items) { const k = x.entity_type || x.entityType; et[k] = (et[k] || 0) + 1; }
return done({ filterTypes: types, sample: items[0] && Object.keys(items[0]), et, mine, first: items[0] && (items[0].occurred_at || items[0].created_at) });
