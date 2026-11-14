const TM = '88e8ea44-1658-4df3-9930-d0902b91073d', TKM = 'd120a6c2-2596-4254-968b-a1bcd3a000bf', CLM = 'f7e488b5-0232-42fd-811c-1f24356af653', EVM = '6fb19115-9356-40f0-b064-840d8f1fad93';
const recs = [[CM, '34735e25-d505-41fa-9fe3-d4a67f283a9a'], [CM, '9d2434da-e5e7-4eb0-a79d-0de77d3c1bcc'], [CM, 'd8c3be5b-14a1-4980-841b-ce64d4845a2a'], [CM, '81727a64-516e-4684-95c2-d5c83fc58599'], [CM, '2bf6927f-8c6c-4ed0-9cc2-99d72ed604cf'],
 [AM, 'f823cd7a-1c34-4d84-9cc8-5b12509034b4'], [AM, '4fec2dfd-91ad-4c94-becf-79f25692c213'], [KM, 'd41bdb40-e6ef-4d63-8f09-8190528242c0'], [KM, '06aa0c1a-b9dd-4118-b033-7be5444dba31'], [KM, 'b9d8eabb-981d-423d-bbf6-200247580881'],
 [TKM, '162ff898-9266-48b5-8c88-e46d14f3fa89'], [CLM, '86def323-f327-42ac-a26c-4f2588ddc92f'], [EVM, 'ca9c8d41-aec0-4b63-82d1-70254405e271'],
 [TM, 'f64e2ab2-83ae-4ec8-9441-ee94d302d8bd'], [TM, 'a9a4c545-cd24-451a-ae7d-6025f16b4797'], [TM, '4d03a01e-9d79-488f-a45e-5be055069a66'], [TM, '251d8190-ffbc-4439-b1d4-9c0fa56cbae9']];
// round-14 leftovers #1363-#1366
for (const n of ['1363', '1364', '1365', '1366']) { const f = [{ field: 'ticket_number', operator: 'equals', value: n }]; const r = await api('GET', '/modules/' + TM + '/records?page=1&per_page=2&filters=' + encodeURIComponent(JSON.stringify(f))); const x = arr(D(r.j))[0]; if (x && /QA RT14/.test(JSON.stringify(x.data))) recs.push([TM, x.id]); }
out.n = recs.length; out.del = {};
// delete activities/contracts before parents
for (const [m, id] of recs) { const r = await api('DELETE', '/modules/' + m + '/records/' + id); out.del[id.slice(0, 8)] = r.s; }
out.view = (await api('DELETE', '/modules/' + CM + '/views/02e4b744-9590-41b9-aa76-c7e3f692d737')).s;
out.report = (await api('DELETE', '/reporting/reports/efa2c92a-7145-4b79-85e8-1de588d04ff0')).s;
out.backup = (await api('DELETE', '/desk/data/backups/01a1d24e-0087-72c7-842e-be6ceb09ce13')).s;
out.post = (await api('DELETE', '/desk/feeds/posts/8ab9ace1-c05c-423b-8452-18c7465fc76a')).s;
out.dm = (await api('DELETE', '/desk/feeds/conversations/6d9b6292-ca12-449c-b794-9522c60f79ec')).s;
out.dept = (await api('GET', '/desk/departments/086be2e9-2a8d-4195-9944-3fa06284eea7')).s;
for (const p of ['/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/users/55c68a51-e073-46c7-ac9f-61ec3e21c101', '/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/accounts/55c68a51-e073-46c7-ac9f-61ec3e21c101']) { const r = await api('DELETE', p); out['hc ' + p.split('/')[3]] = r.s; if (r.s < 300) break; }
await sleep(3000);
// purge bin by exact record ids
const ids = new Set([...recs.map(r => r[1]), '8f751dad-7d45-4764-badd-2caab0e16318', '7a1df4f2-8db3-471a-84ee-6cf889b5db04', '67d7f0e6-e5e6-45e9-9bdf-2ef4cae3564b', '3b33f689-8a3f-4793-a16d-415a458df952', 'efa2c92a-7145-4b79-85e8-1de588d04ff0', '02e4b744-9590-41b9-aa76-c7e3f692d737']);
let pick = []; for (let p = 0; p < 6; p++) { const rb = await api('GET', '/audit/recycle-bin/items?limit=200&app=desk' + (p ? '&page=' + (p + 1) : '')); const items = arr(D(rb.j)); pick.push(...items.filter(i => ids.has(i.record_id))); if (items.length < 200) break; }
const all = await api('GET', '/audit/recycle-bin/items?limit=200'); pick.push(...arr(D(all.j)).filter(i => ids.has(i.record_id)));
pick = [...new Map(pick.map(i => [i.id, i])).values()]; out.binFound = pick.map(i => i.module_label + ':' + i.record_label);
if (pick.length) out.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) })).s;
return fin({ out });
