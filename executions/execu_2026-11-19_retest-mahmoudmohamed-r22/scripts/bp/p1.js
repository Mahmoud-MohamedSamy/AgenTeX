const d = await api('GET', '/desk/departments?page_size=100'); 
const cs = L(d.j?.data).find(x => x.id === CS) || null;
const m = await api('GET', '/desk/departments/' + CS + '/members?page_size=200');
const ms = L(m.j?.data);
return { dep: d.s, csName: cs && cs.name, memS: m.s, memKeys: ms[0] && Object.keys(ms[0]), mem: ms.map(x => [String(x.userId || x.user_id || x.id).slice(0, 8), x.displayName || x.display_name || x.name, x.accessLevel || x.access_level || x.role || x.permission || x.viewOnly].join(' | ')), raw: m.t.slice(0, 300).replace(/[\w.+-]+@[\w.-]+/g, '<mail>') };
