const t = await api('GET', '/desk/tickets/' + TK.CSC); out.tktC = t.s + ' ' + JSON.stringify(D(t.j)).slice(0, 700);
for (const s of ['comments', 'history', 'attachments']) out[s] = (await api('GET', '/desk/tickets/' + TK.CSC + '/' + s)).s;
await go('/views/all/tickets/' + TK.CSC, 9000); out.ui = (await mtxt()).slice(0, 300); await shot('access/c-csc-after-move');
return fin({ out });
