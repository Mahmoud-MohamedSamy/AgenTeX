const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/';
const before = JSON.parse(fs.readFileSync(OUT + 'statuses-before-typechange.json', 'utf8')); const NEW = process.env.NEWTYPE;
const list = before.map(s => s.value === 'QA NDC Distributor' ? { ...s, type: NEW } : s);
for (const [m, b] of [['PUT', { statuses: list }], ['PATCH', { statuses: list }], ['PUT', list]]) { const r = await api(m, '/desk/ticket-statuses', b); log({ m, shape: Array.isArray(b) ? 'array' : 'object', s: r.s, t: r.t.slice(0, 250) }); if (r.s < 300) break; }
const now = ((await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []).find(x => x.value === 'QA NDC Distributor'); log({ nowType: now?.type });
