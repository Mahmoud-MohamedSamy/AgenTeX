const ds = D((await api('GET', '/desk/departments?limit=60')).j); const L = (ds.items || ds).filter(d => /^(Marketing|Sales|HR|Customer Support|Tech)$/.test(d.name));
out.d = {};
for (const d of L) { const s = await api('GET', '/desk/sla/policies?department_id=' + d.id); out.d[d.name] = { id: d.id.slice(0, 8), sla: arr(D(s.j)).map(p => p.name + (p.is_active === false ? '(off)' : '')).join(';').slice(0, 200) }; }
const b = await api('GET', '/desk/blueprints?limit=100'); out.bp = b.s + ' ' + arr(D(b.j)).filter(x => x.is_active || x.status === 'active').map(x => (x.name || '') + '@' + (x.department_name || x.department_id || '').toString().slice(0, 12)).join(' ; ').slice(0, 800);
const ly = await api('GET', '/modules/' + TM + '/layouts'); out.ly = ly.s + ' ' + arr(D(ly.j)).map(x => x.name + '@' + JSON.stringify(x.department_ids || x.departmentIds || x.departments || '').slice(0, 60)).join(' ; ').slice(0, 1200);
return fin({ out });
