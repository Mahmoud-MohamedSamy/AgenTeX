const a = JSON.parse(fs.readFileSync('../a4/p11ev.json')), b = JSON.parse(fs.readFileSync('../a4/p11re.json')); const R = {};
for (const id of [a.rule, a.ctrl, ...Object.values(b.rules)]) R['r' + id.slice(0, 6)] = (await api('DELETE', '/workflow/rules/' + id)).s;
for (const id of [a.t, ...b.tickets]) R['t' + id.slice(0, 6)] = (await api('DELETE', `/modules/${T}/records/${id}`)).s;
R.qaRules = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).filter(r => /^QA AO WF/.test(r.name)).length; R.bh = (await api('GET', '/desk/business-hours')).j?.data?.preset;
fs.appendFileSync('../ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' P11 recheck cleanup ' + JSON.stringify(R) + '\n'); log(JSON.stringify(R));
