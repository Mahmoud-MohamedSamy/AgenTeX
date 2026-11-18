const b = await api('GET', `/modules/${TK}/blueprints`);
return { list: b.s, err: b.s>=300 ? E(b) : '', n: L(b.j?.data).length, names: L(b.j?.data).map(x => (x.definition?.name || x.name) + '|' + x.isActive).slice(0, 40) };
