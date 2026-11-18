out.unshare = await prr('PUT', '/desk/tickets/' + TK.R1 + '/shares', { shares: [] }); out.t0 = new Date().toISOString();
out.spam = await prr('POST', '/desk/tickets/' + TK.R2 + '/spam', { mark_contact: false });
await sleep(3000); out.r2shares = (await api('GET', '/desk/tickets/' + TK.R2 + '/shares')).t.match(/"(department_name|access)":"[^"]+"/g)?.join(',') || 'none';
return fin({ out });
