const out = [];
for (const b of L((await api('GET', `/modules/${TK}/blueprints`)).j?.data)) for (const t of (b.definition?.transitions || [])) { const bf = t.before || {}; const k = Object.keys(bf).filter(x => /crit|cond|shown|when/i.test(x)); if (k.length && JSON.stringify(k.map(x => bf[x])) !== '[null]') out.push(b.definition.name + ' / ' + t.name + ' : ' + JSON.stringify(Object.fromEntries(k.map(x => [x, bf[x]]))).slice(0, 300)); }
return out.slice(0, 6);
