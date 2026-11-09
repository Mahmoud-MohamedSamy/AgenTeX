const p = await call('PATCH', '/iam/users/51666421-12cb-426e-b91e-3003a2a1f923', { status: 'Active' });
const r = await call('GET', '/iam/users?app_key=crm&limit=200');
return { patch: p.s + ' ' + p.t.slice(0, 200), now: ((r.j && r.j.data) || []).filter(u => /valafo4080/.test(u.email)).map(u => u.status) };
