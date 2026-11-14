const p = D((await api('GET', '/iam/me/permissions')).j) || []; out.n = p.length; out.ticketish = p.filter(x => /ticket|setting|archiv|spam|parent|admin|manage|custom/i.test(x));
return fin({ out });
