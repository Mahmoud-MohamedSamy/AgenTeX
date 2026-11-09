const r = await call('GET', '/iam/users?app_key=crm&limit=200');
const users = (r.j && r.j.data) || [];
const v = users.find(u => JSON.stringify(u).includes('valafo4080'));
return { keys: Object.keys(v || {}), sample: JSON.stringify(v).slice(0, 1200), find: users.filter(u => /d23fb4e0|7e5e7c27/.test(JSON.stringify(u))).map(u => JSON.stringify(u).slice(0, 200)) };
