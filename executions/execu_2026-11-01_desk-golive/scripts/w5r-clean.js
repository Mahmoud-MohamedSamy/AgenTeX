const R = { ticket: ['130f789e-de36-4538-ac41-b3baaab908b6', TM], contract: ['4cff9fc4-b8ea-45bf-a4b5-1fee1b5c6dd9', KM], contact: ['4b90180b-cd0d-44e5-914b-9c9fe2c85f45', CM], account: ['cc6244cd-863f-4e23-8e2e-1f528dd72787', AM] };
for (const [k, [id, m]] of Object.entries(R)) out['del ' + k] = (await api('DELETE', '/modules/' + m + '/records/' + id)).s;
out.plan = (await api('DELETE', '/desk/sla/support-plans/e3ac030f-14bb-4884-908a-f4ead909cbcd')).s;
out.pol = (await api('DELETE', '/desk/sla/policies/68b76bdf-a994-4212-b3a1-8658331d625d')).s;
await sleep(3000);
const ids = new Set([...Object.values(R).map(x => x[0]), 'e3ac030f-14bb-4884-908a-f4ead909cbcd', '68b76bdf-a994-4212-b3a1-8658331d625d']);
let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) { const b = await api('GET', '/audit/recycle-bin/items' + q); items = items.concat(arr(D(b.j))); }
const seen = new Set(); items = items.filter(x => !seen.has(x.id) && seen.add(x.id));
const pick = items.filter(x => ids.has(x.record_id)); out.bin = pick.map(x => [x.record_id.slice(0, 8), x.record_label]);
const ok = pick.filter(x => /QA GL W5R|qa-gl-w5r/i.test(x.record_label || ''));
if (ok.length) { const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: ok.map(x => x.id), ids: ok.map(x => x.id) }); out.purge = p.s + ' ' + ok.length; }
for (const [k, [id, m]] of Object.entries(R)) out['get ' + k] = (await api('GET', '/modules/' + m + '/records/' + id)).s;
const left = arr(D((await api('GET', '/desk/sla/support-plans')).j)).filter(x => /W5R/.test(x.name)).length; out.plansLeft = left;
out.hcLeft = /qa-gl-w5r/.test(JSON.stringify(D((await api('GET', '/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/accounts?limit=100')).j)));
return fin({ out });
