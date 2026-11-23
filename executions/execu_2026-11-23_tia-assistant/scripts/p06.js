const s = JSON.parse(fs.readFileSync('../out/p03-profiles.json','utf8'));
const id = s['Desk Agent|desk'].id;
const before = (s['Desk Agent|desk'].body.data||[]).some(x => x.permissionKey === 'ai:tia:use');
const r = await api('POST', `/iam/profiles/${id}/permissions`, { permission_key: 'ai:tia:use', effect: 'GRANT' });
const g = await api('GET', `/iam/profiles/${id}/permissions`);
const users = (await api('GET', '/iam/users?take=200&app_key=desk')).j.data.filter(u => (u.profileNames||'').split(', ').includes('Desk Agent')).map(u => u.displayName + ':' + u.status);
return { profileId: id, before, post: r.s, after: (g.j.data||[]).some(x => x.permissionKey === 'ai:tia:use'), deskAgentUsers: users };
