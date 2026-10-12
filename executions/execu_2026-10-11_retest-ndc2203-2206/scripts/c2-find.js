const out = {};
out.rules = arr((await api('GET', '/workflow/rules')).j.data).map(x => x.id + ' | ' + x.name + ' | active=' + x.isActive);
const tk = await api('GET', '/modules/d120a6c2-2596-4254-968b-a1bcd3a000bf/records?page=1&per_page=100');
out.tasks = arr(tk.j && tk.j.data).map(r => { const o = {}; for (const x of (r.data || [])) o[x.field] = x.value && x.value.value; return r.id + ' | ' + (o.subject || o.name || o.title) + ' | ' + r.created_at; }).filter(s => /2205|QA retest/i.test(s));
out.ticket = (await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/b1eea7f3-e0dc-4ae9-9af0-4c57b393515e')).s;
return done(out);
