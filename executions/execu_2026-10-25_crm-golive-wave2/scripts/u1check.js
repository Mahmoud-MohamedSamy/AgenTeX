const u = await call('GET', '/iam/users?app_key=crm&limit=200');
const me = (u.j.data || []).find(x => JSON.stringify(x).includes('45ffbc5b-7859-4c21-be9e-7b5f30747ca2'));
return JSON.stringify(me).slice(0, 700);
