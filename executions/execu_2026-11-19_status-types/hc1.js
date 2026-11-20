const _api0 = api; api = async (m, p, b) => { for (let i = 0; i < 5; i++) { const r = await _api0(m, p, b); if (r.s !== 500) return r; await sleep(8000); } return _api0(m, p, b); };
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', CONTACT = '34f01ef4-a10c-4e7e-b5f5-71a4219e9768';
const before = JSON.parse(fs.readFileSync(OUT + 'statuses-before-typechange.json', 'utf8'));
const list = before.map(s => s.value === 'QA NDC Distributor' ? { ...s, show_in_help_center: true, help_center_name: 'QA ST shown label' } : s);
const u = await api('PUT', '/desk/ticket-statuses', { statuses: list }); const now = ((await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []).find(x => x.value === 'QA NDC Distributor');
const sv = v => v === null ? { kind: 'null' } : { kind: 'string', value: String(v) }; const fields = o => Object.entries(o).map(([k, v]) => ({ field: k, value: sv(v) }));
const o = { put: u.s, distributor: now, t: {} };
for (const [k, st] of [['shown', 'QA NDC Distributor'], ['hidden', 'QA NDC Waiting Top-Up Manager']]) { const c = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA ST HC ' + k + ' status', description: 'QA ST Help Center label check', department: CS, status: 'Open', priority: 'medium', contact_id: CONTACT }) }); const id = c.j?.data?.id; o.t[k] = { id, create: c.s, err: c.s >= 300 ? c.t.slice(0, 200) : undefined };
  if (id) { o.t[k].move = (await api('PATCH', '/modules/' + TK + '/records/' + id, { data: fields({ status: st }) })).s; await sleep(6000); const t = (await api('GET', '/desk/tickets/' + id)).j?.data || {}; o.t[k].n = t.number || t.ticket_number; o.t[k].desk = t.status; o.t[k].contact = t.contact_id ? 'set' : '-'; } }
// cleanup earlier test data
const tc = JSON.parse(fs.readFileSync(OUT + 'tc.json', 'utf8')); const rj = JSON.parse(fs.readFileSync(OUT + 'rj.json', 'utf8')); const bank = JSON.parse(fs.readFileSync(OUT + 'bank.json', 'utf8'));
o.del = []; for (const id of [...Object.values(tc.t), ...Object.values(rj.t), bank.id]) o.del.push((await api('DELETE', '/modules/' + TK + '/records/' + id)).s);
o.slaDel = (await api('DELETE', '/desk/sla/policies/' + tc.sla)).s;
fs.writeFileSync(OUT + 'hc.json', JSON.stringify(o, null, 1)); log(o);
