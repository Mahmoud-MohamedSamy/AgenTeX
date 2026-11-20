const led = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n');
const burst = led.filter(l => /QA AR FB burst/.test(l)).map(l => l.match(/[0-9a-f-]{36}/)[0]); const timing = led.filter(l => /QA AR FB timing/.test(l)).map(l => l.match(/[0-9a-f-]{36}/)[0]);
const o = { pres: await pres([IDS.A1, IDS.A2]), stat: fs.readFileSync(RUN + '/out/presence-stat.json', 'utf8'), timingOwners: [] , burst: [] };
for (const id of timing) o.timingOwners.push(await ownN(id));
for (const id of burst.slice(0, 20)) { const own = await ownN(id); const b = await bl(id); const h = await act(id); const ev = (Array.isArray(h) ? h : []).filter(x => /assign|backlog|round/.test(x.action)).map(x => x.action + ' ' + JSON.stringify(x.summary || {}).slice(0, 160)); o.burst.push({ own, b, ev }); }
o.unassignedSample = o.burst.filter(x => !x.own).slice(0, 2); o.assignedSample = o.burst.filter(x => x.own).slice(0, 1); delete o.burst;
o.statLog = fs.existsSync(RUN + '/out/presence-stat.json.log') ? fs.readFileSync(RUN + '/out/presence-stat.json.log', 'utf8').split('\n').slice(-6) : null;
return o;
