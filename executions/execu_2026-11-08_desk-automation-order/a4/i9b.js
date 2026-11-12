const a = JSON.parse(fs.readFileSync('../a4/agent.json'));
const all = arr((await api('GET', '/iam/users?take=200')).j?.data);
log(all.length, JSON.stringify(all.filter(x => x.userId === a.uid || /WF Agent|\+wf@/i.test((x.displayName || '') + (x.email || ''))).map(x => ({ id: x.userId, n: x.displayName, st: x.status, p: x.profileNames }))));
