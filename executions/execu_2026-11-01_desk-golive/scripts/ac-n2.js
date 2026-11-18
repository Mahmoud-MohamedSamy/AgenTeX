const n = await api('GET', '/notifications?limit=50&category=general&modules=desk&apps=desk'); out.n = JSON.stringify(D(n.j)).match(/"title":"[^"]{0,100}"/g)?.slice(0, 20);
return fin({ out });
