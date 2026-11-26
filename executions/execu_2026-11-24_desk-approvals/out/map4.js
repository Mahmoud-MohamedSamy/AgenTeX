const u = await api('GET', '/iam/users?take=300&app_key=desk'); const us = arr(u.j?.data?.users || u.j?.data?.items || u.j?.data);
const labels = fs.readFileSync("D:/Software Testing/Automation/Agentex Installation/Agentex Installation/docs/Credentials/TAVI Desk Credentials.csv", "utf8").split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(',')[0]);
const q = await api('POST', '/desk/agents/departments/query', { user_ids: us.map(x => x.id || x.userId), agent_user_ids: us.map(x => x.id || x.userId) });
const dj = q.j?.data; 
return { n: us.length, sample: Object.keys(us[0] || {}), qs: q.s, qshape: JSON.stringify(dj).slice(0, 400), users: us.map(x => [x.name || x.displayName || x.fullName || ((x.firstName||'')+' '+(x.lastName||'')), x.id || x.userId, (x.roles||[]).map(r=>r.name||r).join('/') || x.role?.name || x.roleName, x.status, x.profile?.name || x.profileName || ''].join(' | ')), labels };
