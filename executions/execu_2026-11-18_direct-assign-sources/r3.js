const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const NM = { '876ce871-2b02-4854-89a7-68050391c62b': 'Test User 1', '97be04b6-0a08-4883-aa51-e1650b11cab7': 'owner (importer)', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4': 'Dev Team 2' };
await sleep(30000);
const L = arr((await api('GET', '/modules/' + T + '/records?limit=20')).j).filter(x => x.created_at > '2026-11-18T14:20');
const rows = []; for (const x of L) { const o = {}; for (const f of ((await api('GET', '/modules/' + T + '/records/' + x.id)).j?.data?.data || [])) o[f.field] = f.value?.value; if (/QA RT22 (WF|RR) import/.test(o.subject || '')) rows.push({ id: x.id, n: o.ticket_number, subj: o.subject, owner: NM[o.owner] || o.owner || 'Unassigned', src: x.source }); }
log(rows); fs.writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/tavi-rows4.json', JSON.stringify(rows, null, 1));
