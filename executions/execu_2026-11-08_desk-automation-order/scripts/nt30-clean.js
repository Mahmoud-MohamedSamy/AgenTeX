// NT-30 cleanup (11 Nov): restore 3 Dept A rules, delete QA templates, tickets, team, membership, user.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d';const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));const U=n.uid;const R={rules:{},tickets:{}};
const o=JSON.parse(fs.readFileSync('../nt30-rules-orig.json','utf8'));
for(const [k,v] of Object.entries(o))R.rules[k]=(await api('PUT','/desk/notification-rules/departments/'+A+'/rules/'+encodeURIComponent(k),v)).s;
R.rulesNow=(await api('GET','/desk/notification-rules/departments/'+A)).j.data.rules.filter(x=>o[x.key]).map(x=>x.key+' enabled='+x.is_enabled+' tpl='+x.template_id);
for(const t of n.templates||[])R['tpl'+t.slice(0,6)]=(await api('DELETE','/desk/email-templates/'+t)).s;
for(const id of [...n.tickets,n.mailctl].filter(Boolean))R.tickets[id.slice(0,6)]=(await api('DELETE','/modules/'+M+'/records/'+id)).s;
R.team=(await api('DELETE','/desk/teams/'+n.team)).s;
const d=(await api('GET','/desk/departments/'+A)).j.data;R.dept=(await api('PUT','/desk/departments/'+A+'/agents',{agent_user_ids:d.agent_user_ids.filter(x=>x!==U)})).s;
R.user=(await api('DELETE','/iam/users/'+U)).s;
const w=await api('GET','/desk/agents/'+U+'/workload');R.workloadAfter=w.s;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-30 cleanup '+JSON.stringify(R).slice(0,600)+'\n');return R;
