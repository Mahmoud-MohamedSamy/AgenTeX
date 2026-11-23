const a = arr((await api('GET', '/iam/users?take=200')).j.data);
const ids = ['5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4','876ce871-2b02-4854-89a7-68050391c62b','97be04b6-0a08-4883-aa51-e1650b11cab7'];
const own = a.find(u => u.isOwner);
return { agents: a.filter(u => ids.includes(u.userId)).map(u => ({ id: u.userId, n: u.displayName, st: u.status, org: u.orgUnitId, prof: u.profileNames })), owner: own && { id: own.userId, n: own.displayName } };
