const r = await api('GET', `/modules/${TK}/blueprints/23339d62-fecf-4324-8950-5fa1bfdef0df`); const s = await api('GET', `/modules/${TK}/records/9ec8bdc5-2362-4386-a4cd-e5bee332d0c7/blueprint-state`);
return { bp: E(r), st: E(s), stKeys: s.j?.data && Object.keys(s.j.data) };
