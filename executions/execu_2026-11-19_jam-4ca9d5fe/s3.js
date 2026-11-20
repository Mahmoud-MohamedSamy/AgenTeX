const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', DB = '4853562a-0b4d-45cb-ba34-9f2118fcd32c', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_jam-4ca9d5fe/out/'; const o = JSON.parse(fs.readFileSync(OUT + 's1.json', 'utf8'));
const res = [];
for (let i = 0; i < 9; i++) { await sleep(10000); const d = (await api('GET', '/modules/' + TK + '/records/' + o.back)).j?.data?.data || []; const t = (await api('GET', '/desk/tickets/' + o.back)).j?.data || {}; const ow = (d.find(f => f.field === 'owner') || {}).value?.value || null; res.push(new Date().toISOString().slice(11, 19) + ' owner=' + (ow === TU1 ? 'TU1' : ow) + ' in_backlog=' + t.in_backlog); if (ow) break; }
log(res); const own = (await api('GET', '/desk/tickets/' + o.own)).j?.data || {};
log({ ownTicket: own.status, tu1Open: (((await api('GET', '/desk/agents/' + TU1 + '/workload')).j?.data?.departments || []).find(d => d.department_id === DB) || {}).open_tickets, presence: (await api('POST', '/desk/agents/presence/query', { user_ids: [TU1] })).j?.data?.agents?.[0]?.presence });
