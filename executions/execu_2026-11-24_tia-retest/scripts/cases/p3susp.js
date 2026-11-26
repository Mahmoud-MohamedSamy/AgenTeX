const U = '3445ec4a-020e-4f12-b156-dd2de7610164'; const st = process.env.ST;
const r = await api('PATCH', `/iam/users/${U}`, { status: st }); ledger(`P3 B-08: CRM Manager test user set ${st} (${r.s})`); return r.s + ' ' + (r.j?.error?.code || '');
