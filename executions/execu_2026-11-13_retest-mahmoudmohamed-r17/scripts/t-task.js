const r = await api('GET', '/modules/d120a6c2-2596-4254-968b-a1bcd3a000bf/records?limit=2&sort=-created_at');
const x = arr(r.j && r.j.data)[0] || arr(r.j)[0];
const d = await api('GET', '/desk/departments');
return { task: x && x.data, depts: arr(d.j && d.j.data || d.j).map(z => [z.id, z.name]) };
