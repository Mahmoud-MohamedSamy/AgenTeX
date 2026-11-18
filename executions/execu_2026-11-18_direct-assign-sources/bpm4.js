const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/bpmid.json'; const o = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const d = (await api('GET', '/modules/' + TK + '/records/' + o.tickets.T1)).j?.data?.data || [];
log(d.filter(x => /sla|due|escalat|policy/i.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value?.value).slice(0, 60)));
for (const p of ['/desk/tickets/' + o.tickets.T1 + '/sla', '/desk/sla/policies?department_id=7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', '/desk/sla-policies?department_id=7e1ac409-58b0-41ab-97e1-0e7d5c8c5158']) { const r = await api('GET', p); log(p.slice(0, 40) + ' ' + r.s + ' ' + r.t.slice(0, 300)); }
