const uid = '9d182dfa-05f3-4af7-9685-8615a2fbe537';
const a = await api('GET', '/desk/agents?limit=100');
const L = arr(a.j?.data ?? a.j); const me = L.find(x => JSON.stringify(x).includes(uid));
return { s: a.s, n: L.length, keys: me && Object.keys(me), me: me && JSON.stringify(me).replace(/"email":"[^"]*"/g,'"email":"<m>"').slice(0, 1200) };
