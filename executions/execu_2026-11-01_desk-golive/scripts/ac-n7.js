await sleep(30000); const n = await api('GET', '/notifications?limit=20&category=general&modules=desk&apps=desk'); out.n = (JSON.stringify(D(n.j)).match(/"title":"[^"]{0,120}"/g) || []).slice(0, 5);
return fin({ out });
