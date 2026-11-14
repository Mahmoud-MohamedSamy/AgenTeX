const K = 'ca2bb940-f2ba-46f0-a016-8483746430be', A = 'd61e2871-2a6e-4019-9318-16b6e798f93b';
await go('/modules/' + KM + '/records/' + K, 9000); await sleep(3000);
const sd = page.getByText('Start Date', { exact: true }).first(); if (await sd.count()) { await sd.scrollIntoViewIfNeeded(); await sleep(1000); }
out.props = (await mtxt()).match(/Start Date[\s\S]{0,120}/)?.[0];
await shot('w5/W5-17-contract-dates');
out.delK = (await api('DELETE', '/modules/' + KM + '/records/' + K)).s;
out.delA = (await api('DELETE', '/modules/' + AM + '/records/' + A)).s;
await sleep(2000);
const ids = new Set([K, A]); let pick = [];
for (const q of ['?limit=200', '?limit=200&app=desk']) { const rb = await api('GET', '/audit/recycle-bin/items' + q); pick.push(...arr(D(rb.j)).filter(i => ids.has(i.record_id))); }
const seen = new Set(); pick = pick.filter(i => !seen.has(i.id) && seen.add(i.id));
out.pick = pick.map(i => i.module_label + ':' + i.record_label);
if (pick.length) out.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) })).s;
out.after = [(await api('GET', '/modules/' + KM + '/records/' + K)).s, (await api('GET', '/modules/' + AM + '/records/' + A)).s];
return fin({ out });
