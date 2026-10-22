const items = []; let cur = null;
for (let i = 0; i < 15; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); items.push(...arr(r.j?.data)); cur = r.j?.meta?.next_cursor; if (!cur) break; }
const ids = ['e883e897-d5e0-4fe1-a84a-ff8d888da778', '6a570979-3f17-4a8f-bd34-46679c06097d', 'db1e3c4b-d081-4e60-a4b7-4462d6d9722b', 'f6be00e6-b22a-41a5-a3c4-4b68e49fd60c', 'f01e6c73-e8c3-4cf9-a109-ff99a2a57b11'];
const hit = items.filter(x => ids.includes(x.record_id));
let p = null; if (hit.length) p = (await api('POST', '/audit/recycle-bin/delete', { ids: hit.map(x => x.id) })).s;
const meeting = await api('GET', '/modules/f13e02be-03d3-46c3-a74e-22c7770823ca/records/e883e897-d5e0-4fe1-a84a-ff8d888da778');
return done({ inBin: hit.map(x => x.module_key + ':' + JSON.stringify(x.record_label)), purge: p, meetingGet: meeting.s });
