const TK = 'e8e5e302-3873-4e32-b945-c9cd25c7659d'; const o = JSON.parse(fs.readFileSync('../a6/rev.json'));
log({ t: (await api('DELETE', `/modules/${TK}/records/${o.TID}`)).s, b: (await api('DELETE', `/modules/${TK}/blueprints/${o.BID}`)).s });
