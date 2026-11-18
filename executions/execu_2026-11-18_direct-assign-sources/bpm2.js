const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const L = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.states)) || [];
const rec = async id => { const d = (await api('GET', '/modules/' + TK + '/records/' + id)).j?.data?.data || []; const o = {}; for (const x of d) o[x.field] = x.value?.value; return o; };
const bstate = async id => { const r = await api('GET', `/modules/${TK}/records/${id}/blueprint-state`); return { s: r.s, st: L(r.j?.data?.states)[0] || null, raw: r.t.slice(0, 200) }; };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/bpmid.json';
const o = JSON.parse(fs.readFileSync(OUT, 'utf8')); o.after_create = {};
for (const [k, id] of Object.entries(o.tickets)) { const b = await bstate(id); const x = await rec(id); o.after_create[k] = { n: x.ticket_number, status: x.status, bp: b.st ? JSON.stringify(b.st).slice(0, 200) : 'not in blueprint (' + b.s + ')' }; }
fs.writeFileSync(OUT, JSON.stringify(o, null, 1)); log(o.after_create);
