const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f07.json', 'utf8')); const o = { t: new Date().toISOString() };
const nm = { [J.dA]: 'Dept A', [J.dB]: 'Dept B', [CS]: 'Customer Support' };
for (const k of ['dA', 'dB']) { const d = (await api('GET', '/desk/departments/' + J[k])).j?.data; o[k] = { active: d?.is_active, agents: d?.agent_user_ids?.length, keys: Object.keys(d || {}).filter(x => /transfer|disab|status|channel/i.test(x)).map(x => x + '=' + JSON.stringify(d[x]).slice(0, 80)) }; }
const x = await rec(J.x); o.xDept = nm[x.department] || x.department; const dk = (await api('GET', '/desk/tickets/' + J.x)).j?.data; o.xDesk = nm[dk?.department_id] || dk?.department_id; o.xOwner = x.owner === OWNER ? 'OWNER' : x.owner;
return o;
