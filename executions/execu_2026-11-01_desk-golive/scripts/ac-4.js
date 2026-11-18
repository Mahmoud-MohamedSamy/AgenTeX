const r1 = await api('GET', '/iam/permissions?app_key=desk'); out.perm = r1.t.slice(0, 400); out.permAll = JSON.stringify(r1.j).match(/"[a-z_]+[.:][a-z_.:]+"/g);
const r2 = await api('GET', '/iam/profiles/44444444-4444-4444-4444-444444444401/effective'); out.eff = r2.t.slice(0, 500);
const r3 = await api('GET', '/iam/permission-tree?app_key=desk'); out.tree = JSON.stringify(r3.j).match(/"desk[.:][a-z_.:]+"/g);
out.agentP = (await api('GET', '/iam/profiles?app_key=desk')).j;
return fin({ out });
