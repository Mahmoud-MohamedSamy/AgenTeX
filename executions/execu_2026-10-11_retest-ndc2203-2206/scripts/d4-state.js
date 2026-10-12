const out = {};
out.depts = (await api('GET', '/desk/departments')).t.slice(0, 500);
out.tagctx = (await api('GET', '/desk/tags/context')).t.slice(0, 500);
const tk = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?page=1&per_page=5'); out.tickets = tk.s + ' total=' + JSON.stringify(tk.j && tk.j.meta) + ' n=' + arr(tk.j && tk.j.data).length;
out.rules = (await api('GET', '/workflow/rules')).t.slice(0, 300);
out.me = (await api('GET', '/iam/me')).t.slice(0, 400);
out.ticketFields = arr((await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/fields')).j.data).map(f => f.fieldName + ':' + f.dataType + (f.required ? '*' : '')).join(', ');
return done(out);
