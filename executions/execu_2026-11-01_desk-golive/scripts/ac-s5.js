const Du = '876ce871-2b02-4854-89a7-68050391c62b'; const P = id => '44444444-4444-4444-4444-444444444' + id; const MGR = 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
const r = await api('POST', '/iam/users/' + Du + '/profiles', { profile_id: P('402'), scope_id: MGR, replace: true }); out.rep = r.s + ' ' + r.t.slice(0, 200);
const us = D((await api('GET', '/iam/users?app_key=desk&page_size=500&page=1')).j); out.d = ((us.items || us).find(u => u.userId === Du) || {}).profileNames;
return fin({ out });
