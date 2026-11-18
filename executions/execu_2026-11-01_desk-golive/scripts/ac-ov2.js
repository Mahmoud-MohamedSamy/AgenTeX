const r = await api('DELETE', '/iam/users/' + US.C + '/overrides/' + encodeURIComponent('desk:ticket:share') + '?app_key=desk'); out.del = r.s + ' ' + r.t.slice(0, 120);
out.list = (await api('GET', '/iam/users/' + US.C + '/overrides?app_key=desk')).t.slice(0, 120);
out.mk2 = (await api('GET', '/desk/tickets/' + TK.MK2 + '/shares')).t.match(/"access":"[a-z_]+"/g);
return fin({ out });
