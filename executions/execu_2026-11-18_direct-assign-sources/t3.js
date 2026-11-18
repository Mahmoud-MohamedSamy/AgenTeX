const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const NM = { '876ce871-2b02-4854-89a7-68050391c62b': 'Test User 1', '97be04b6-0a08-4883-aa51-e1650b11cab7': 'owner (importer)', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4': 'Dev Team 2', '3445ec4a-020e-4f12-b156-dd2de7610164': 'mahmoud.mahamed1515' };
await sleep(20000);
const L = arr((await api('GET', '/modules/' + T + '/records?limit=40&sort=-created_at')).j);
const rows = [];
for (const x of L.slice(0, 40)) { const r = await api('GET', '/modules/' + T + '/records/' + x.id); const d = r.j?.data?.data || []; const o = {}; for (const f of d) o[f.field] = f.value?.value; if (/QA RT22/.test(o.subject || '')) rows.push({ id: x.id, n: o.ticket_number, subj: o.subject, owner: NM[o.owner] || o.owner || null, created: x.created_at }); }
log(rows); fs.writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/tavi-rows.json', JSON.stringify(rows, null, 1));
