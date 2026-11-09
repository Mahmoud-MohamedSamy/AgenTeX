const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const users = arr((await api('GET', '/iam/users?limit=200')).j?.data); const nm = id => { const u = users.find(u => (u.user_id || u.id) === id); return u ? (u.email || '').replace(/@.*/, '') : id; };
const r = await api('GET', `/modules/${L}/records?page=1&per_page=10&sort_by=created_at&sort_dir=desc`);
const rows = arr(r.j?.data).map(x => { const o = {}; for (const d of x.data || []) o[d.field] = d.value && d.value.value !== undefined ? d.value.value : d.value; return { n: o.first_name, owner: nm(o.owner), src: x.source || o.source, id: x.id }; }).filter(x => /QA RT r8 (AR|control)/.test(x.n || ''));
const ex = []; for (const x of rows) ex.push(x.n + ': ' + JSON.stringify(arr((await api('GET', `/workflow/executions?recordId=${x.id}`)).j?.data).map(e => (e.assignmentRuleId ? 'AR ' : '') + e.outcome)));
return done({ rows, ex });
