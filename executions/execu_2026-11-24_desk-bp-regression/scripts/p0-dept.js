// Phase 0: create department "QA BP Reg Dept" (records ids in ../made.json for cleanup).
const MADE = '../made.json';
const made = fs.existsSync(MADE) ? JSON.parse(fs.readFileSync(MADE, 'utf8')) : { dept: null, team: null, tickets: [], bps: [], other: [] };
const keep = () => fs.writeFileSync(MADE, JSON.stringify(made, null, 1));
const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7', AG_A = '9d182dfa-05f3-4af7-9685-8615a2fbe537', AG_B = '2a7c1bc4-f6d4-4bd3-805e-0496ece13987', VO = 'd23fb4e0-248d-41f6-af60-d28885a7007e';
const exist = arr((await api('GET', '/desk/departments')).j?.data).find(d => d.name === 'QA BP Reg Dept');
if (exist) { made.dept = exist.id; keep(); return { already: exist.id }; }
const body = { name: 'QA BP Reg Dept', description: 'QA Blueprint go-live regression (24 Nov 2026). Delete after the run.', visibility: 'private', agent_user_ids: [OWNER, AG_A, AG_B, VO], view_only_agent_user_ids: [VO] };
const r = await api('POST', '/desk/departments', body);
const id = r.j?.data?.id; if (id) { made.dept = id; keep(); }
const after = id ? (await api('GET', '/desk/departments/' + id)).j?.data : null;
return { s: r.s, err: r.j?.error || null, id, agents: after?.agent_user_ids?.length, viewOnly: after?.view_only_agent_user_ids, routing: after?.routing_strategy, channels: after?.channels, emails: after?.email_addresses };
