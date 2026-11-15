const mid = await modId(); const out = {}; const f = x => FP + x;
// J4: delete a field that is one target of 'basic' (and radio)
const d = await api('DELETE', '/modules/' + mid + '/fields/' + I.fields[f('tmp')]); out.J4del = SR(d).slice(0, 600);
out.J4fieldStill = (await fieldsOf(mid)).some(x => x.fieldName === f('tmp'));
const b = (await getRule(mid, I.rBasic)).j.data; out.J4basic = { status: b.status, err: b.definitionError || null };
// J7: layout with a rule, then delete the layout
const L = await getLayout(mid, I.layout); const lb = JSON.parse(JSON.stringify(L)); delete lb.id; for (const k of ['displayInHelpCenter','helpCenterDisplayName','helpCenter','departmentIds','defaultDepartmentIds','ticketStatuses','allowNonDepartmentAgents','rowVersion','createdAt','lastModifiedAt','isDefault','is_default']) delete lb[k]; lb.name = P + ' J7 Layout';
const c = await api('POST', '/modules/' + mid + '/layouts', lb); out.J7lay = SR(c).slice(0, 200); const jl = c.j && c.j.data && c.j.data.id; if (!jl) return out; I.j7Layout = jl; SAVE(); LED('layout "QA RT18 J7 Layout" ' + jl + ' (Leads)');
const r = await mkRule(mid, { layoutId: jl, name: P + ' J7 rule', primaryField: f('tier'), branches: [br(eq(f('tier'), 'Gold'), [show([f('reason')])])] }, 'Leads'); out.J7rule = SR(r).slice(0, 200); I.j7Rule = r.j && r.j.data && r.j.data.id; SAVE();
const del = await api('DELETE', '/modules/' + mid + '/layouts/' + jl); out.J7layDel = SR(del).slice(0, 400);
const g = await getRule(mid, I.j7Rule); out.J7ruleAfter = g.s + ' ' + (g.j && g.j.data ? g.j.data.status + ' err=' + JSON.stringify(g.j.data.definitionError || null) : E(g));
out.J7inList = (await rules(mid)).filter(x => x.id === I.j7Rule).map(x => x.name + ' ' + x.status);
out.J7layStill = (await api('GET', '/modules/' + mid + '/layouts/' + jl)).s;
return out;
