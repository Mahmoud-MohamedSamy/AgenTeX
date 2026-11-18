const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + ' ' + r.t.slice(0, 160); };

const AG = '44444444-4444-4444-4444-444444444402', SUP = '44444444-4444-4444-4444-444444444404';

const pid = 'b1050a28-bda8-47ea-846d-12b34430d84c'; out.pid = pid;
if (pid) { out.g1 = await pr('POST', '/iam/profiles/' + pid + '/permissions', { permission_key: 'desk:ticket:all_departments', effect: 'GRANT' }); out.g2 = await pr('POST', '/iam/profiles/' + pid + '/permissions', { permission_key: 'desk:ticket:move', effect: 'DENY' });
  const e = D((await api('GET', '/iam/profiles/' + pid + '/effective')).j) || []; out.eff = e.filter(k => /desk:ticket:/.test(k)).map(k => k.replace('desk:ticket:', '')).join(' ');
  out.assign = await pr('POST', '/iam/users/' + US.D + '/profiles', { profile_id: pid, scope_id: 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd', replace: true }); }
const us = D((await api('GET', '/iam/users?app_key=desk&page_size=500&page=1')).j); out.d = ((us.items || us).find(u => u.userId === US.D) || {}).profileNames;
return fin({ out });
