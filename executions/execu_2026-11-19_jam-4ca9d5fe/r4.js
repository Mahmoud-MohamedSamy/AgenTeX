const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_jam-4ca9d5fe/out/';
const o = JSON.parse(fs.readFileSync(OUT + 'r3.json', 'utf8')); const id = process.env.CLOSE === 'B' ? o.Bown : o.Aown;
const p = await api('PATCH', '/modules/' + TK + '/records/' + id, { data: [{ field: 'status', value: { kind: 'string', value: 'Closed' } }] });
log({ closer: process.env.WHO, close: p.s, at: new Date().toISOString().slice(11, 19), err: p.s >= 300 ? p.t.slice(0, 200) : undefined });
