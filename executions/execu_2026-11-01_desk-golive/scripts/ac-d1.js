await go('/views/all/tickets/' + TK.CSE, 10000); out.ui = (await mtxt()).slice(0, 600); out.toast = await toasts(); await shot('access/d-cse-publicRO');
out.tkt = (await api('GET', '/desk/tickets/' + TK.CSE)).s;
return fin({ out });
