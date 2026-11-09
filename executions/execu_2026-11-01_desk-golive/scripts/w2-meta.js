const T='e8e5e302-3873-4e32-b945-c9cd25c7659d', C='0bbb599e-013b-4465-a41e-85a324a4e3ac', D='9a7e391c-be72-49e4-a1cf-763e5c88e23d';
const o = {};
const f = await api('GET', `/modules/${T}/fields`); o.fields = arr(f.j && f.j.data).map(x => [x.key || x.fieldKey, x.dataType || x.type, x.required ? 'R' : '', x.isSystem ? 'S' : ''].join(':'));
const l = await api('GET', `/modules/${T}/layouts`); o.layouts = arr(l.j && l.j.data).map(x => ({ id: x.id, name: x.name, dept: x.departmentId || x.department_id, def: x.isDefault }));
const cf = await api('GET', `/modules/${C}/fields`); o.cfields = arr(cf.j && cf.j.data).filter(x => x.required).map(x => x.key || x.fieldKey);
const d = await api('GET', `/desk/departments/${D}`); o.dept = d.s; o.deptKeys = d.j && d.j.data ? JSON.stringify(d.j.data).slice(0, 600) : d.t.slice(0, 200);
const ag = await api('GET', `/desk/departments/${D}/agents`); o.agents = ag.s + ' ' + JSON.stringify(ag.j && ag.j.data).slice(0, 400);
const tk = await api('GET', `/desk/tickets?limit=1&department_id=${D}`); o.ticketSample = tk.s + ' ' + JSON.stringify(tk.j).slice(0, 1500);
return done(o);
