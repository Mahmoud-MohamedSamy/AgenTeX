const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const p = await api('POST', '/modules/' + L + '/views', { name: 'QA RT k7', kind: 'list', visibility: 'everyone', settings: { columns: ['first_name', 'phone', 'owner'], criteria: { conditions: [{ field: 'company', operator: 'equals', value: 'test' }] } } });
return done({ post: p.s, id: p.j && p.j.data && p.j.data.id, err: p.s >= 400 ? p.t.slice(0, 400) : '' });
