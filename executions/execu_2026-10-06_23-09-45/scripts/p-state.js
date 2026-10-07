const U = '18ba78c4-20c2-49e3-b159-55e1af2043ae';
const a = arr((await api('GET', '/iam/users?page_size=200')).j.data).find(u => u.userId === U);
const d = arr((await api('GET', '/iam/users?app_key=desk&page_size=200')).j.data).find(u => u.userId === U) || {};
rec('STATE', 'INFO', `profiles "${a.profileNames}"; desk org unit ${d.orgUnitId}`);
return done();
