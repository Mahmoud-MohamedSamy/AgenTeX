const r = await api('GET', `/modules/${TK}/blueprints?pageSize=200`);
const l = L(r.j?.data); const out = {n: l.length, s: r.s};
const tb = l.filter(b => /test blueprint/i.test(b.name||b.definition?.name||''));
out.tb = tb.map(b=>({id:b.id,name:b.name,active:b.isActive}));
if (tb[0]) { const d = await getBp(tb[0].id); const def = d.definition || d.draftDefinition || d; out.trans = JSON.stringify((def.transitions||[]).map(t=>({n:t.name,during:t.during}))).slice(0,2500); out.dept=def.departmentId; }
return out;
