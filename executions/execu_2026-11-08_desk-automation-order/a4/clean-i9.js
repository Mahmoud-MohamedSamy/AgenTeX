const o = JSON.parse(fs.readFileSync('../a4/i9-out.json')); const R = {};
R.rule = (await api('DELETE', '/workflow/rules/' + o.rule)).s;
for (const k of ['ctrl', 'susp', 'manual', 't1', 't2', 't3']) if (o[k]) R[k] = (await api('DELETE', `/modules/${T}/records/${o[k]}`)).s;
R.user = (await api('DELETE', '/iam/users/' + o.AG)).s; await sleep(2000);
R.userLeft = arr((await api('GET', '/iam/users?take=200')).j?.data).filter(x => x.userId === o.AG).map(x => x.status);
R.deptA = ((await api('GET', `/desk/departments/${D}`)).j?.data?.agent_user_ids || []).length;
R.qaRules = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).filter(r => /^QA AO WF/.test(r.name)).length;
fs.appendFileSync('../ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' I9 cleanup ' + JSON.stringify(R) + '\n'); log(JSON.stringify(R));
