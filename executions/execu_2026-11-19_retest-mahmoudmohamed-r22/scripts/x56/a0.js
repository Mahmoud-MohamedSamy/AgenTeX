const o = {}; const g = await getBp('23339d62-fecf-4324-8950-5fa1bfdef0df'); o.exists = !!g; if (!g) return o;
o.active = g.isActive; o.rev = g.revision; o.name = g.definition.name; o.dept = g.definition.departmentId; o.entry = g.definition.entryCriteria;
o.states = g.definition.states.map(s => s.id); o.tr = g.definition.transitions.map(t => [t.id, t.name, t.fromStateId + '->' + t.toStateId, JSON.stringify(t.before || {}), JSON.stringify(t.during || {})]);
const T = '9ec8bdc5-2362-4386-a4cd-e5bee332d0c7'; o.t = await rec(T); o.t = { n: o.t.ticket_number, status: o.t.status, pr: o.t.priority, subj: o.t.subject };
o.bs = await bstate(T);
return o;
