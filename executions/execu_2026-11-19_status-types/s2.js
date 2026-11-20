const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/';
const B = '3445ec4a-020e-4f12-b156-dd2de7610164';
const DEPTS = { Marketing: '2a73bbc0-efb3-4250-bf9b-2fdc98236794', 'QA NDC Accounting': 'c0e05c3e', 'QA NDC Client Complaints': 'f131cbef', "QA NDC Clients' Financial Investigations": 'a026f008', 'QA NDC Financial approval': '77fca069', 'QA NDC FLY-WT Refund': '3abf4280', 'QA NDC Manual Invoice': '95a6fd64-b877-435e-8e23-62c75717f95f', 'QA NDC NDC Finance': '14130980', 'QA NDC Quality Assurance': '0cade824' };
const deps = (await api('GET', '/desk/departments')).j?.data; const DL = Array.isArray(deps) ? deps : (deps?.departments || []);
for (const k of Object.keys(DEPTS)) { const f = DL.find(d => d.id.startsWith(DEPTS[k])); if (f) DEPTS[k] = f.id; }
const st = JSON.parse(fs.readFileSync(OUT + 'statuses.json', 'utf8'));
const sv = v => v === null ? { kind: 'null' } : { kind: 'string', value: String(v) }; const fields = o => Object.entries(o).map(([k, v]) => ({ field: k, value: sv(v) }));
const wl = async () => { const x = (await api('GET', '/desk/agents/' + B + '/workload')).j?.data; return x; };
const made = []; const w0 = await wl(); fs.writeFileSync(OUT + 'wl0.json', JSON.stringify(w0, null, 1));
for (const s of st) {
  let rec = { status: s.value, type: s.type };
  for (const [dn, did] of Object.entries(DEPTS)) {
    const c = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA ST ' + s.value, description: 'QA ST status type test', department: did, status: 'Open', priority: 'medium', owner: B }) });
    const id = c.j?.data?.id; if (!id) { rec.createErr = (rec.createErr || '') + dn + ':' + c.s + ' '; continue; }
    made.push(id);
    const p = await api('PATCH', '/modules/' + TK + '/records/' + id, { data: fields({ status: s.value }) });
    if (p.s < 300) { rec.id = id; rec.dept = dn; break; }
    rec.tries = (rec.tries || '') + dn + ':' + p.s + ' ' + (p.j?.error?.details ? JSON.stringify(p.j.error.details).slice(0, 80) : (p.j?.error?.code || '')) + ' | ';
    await api('DELETE', '/modules/' + TK + '/records/' + id);
  }
  log(rec.status + ' [' + rec.type + '] -> ' + (rec.id ? 'moved in ' + rec.dept : 'NOT moved: ' + (rec.tries || rec.createErr || '').slice(0, 200)));
  fs.appendFileSync(OUT + 'tickets.jsonl', JSON.stringify(rec) + '\n');
}
fs.writeFileSync(OUT + 'made.json', JSON.stringify(made));
