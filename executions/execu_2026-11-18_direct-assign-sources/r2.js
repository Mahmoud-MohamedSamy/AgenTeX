const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/ids3.json'; const ids = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const DB = '4853562a-0b4d-45cb-ba34-9f2118fcd32c', T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const NM = { '876ce871-2b02-4854-89a7-68050391c62b': 'Test User 1', '97be04b6-0a08-4883-aa51-e1650b11cab7': 'owner (importer/creator)', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4': 'Dev Team 2' };
const sv = v => v === null ? { kind: 'null' } : { kind: 'string', value: String(v) }; const fields = o => Object.entries(o).map(([k, v]) => ({ field: k, value: sv(v) }));
ids.manual = {};
for (const s of ['QA RT22 WF manual create', 'QA RT22 RR manual create']) { const c = await api('POST', '/modules/' + T + '/records', { data: fields({ subject: s, description: 'QA RT22', department: DB, status: 'Open', priority: 'medium', owner: null }) }); ids.manual[s] = c.j?.data?.id; }
fs.writeFileSync(OUT, JSON.stringify(ids, null, 1));
await sleep(25000);
for (const [s, id] of Object.entries(ids.manual)) { const o = {}; for (const f of ((await api('GET', '/modules/' + T + '/records/' + id)).j?.data?.data || [])) o[f.field] = f.value?.value; log({ s, n: o.ticket_number, owner: NM[o.owner] || o.owner || 'Unassigned' }); }
