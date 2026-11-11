const R=JSON.parse(fs.readFileSync('../a4/p1.json','utf8'));const o={};
for(const k of ['P18','P23a','P23b']){const ex=arr2((await api('GET','/workflow/executions?recordId='+R[k].ticket.id)).j?.data);const d=ex[0]?.dispatches?.[0]||{};const x={...d};delete x.id;delete x.executionId;delete x.ruleActionId;o[k]=JSON.stringify(x).slice(0,700);}
const sk=await api('GET','/desk/skills?department_id='+D);o.skills=[sk.s,JSON.stringify(arr2(sk.j?.data).map(s=>s.key||s.name)).slice(0,300)];
const ag=await api('GET','/desk/departments/'+D+'/agents');o.deptAgents=arr2(ag.j?.data).map(a=>(a.user_id||a.id||'').slice(0,8)+' '+(a.display_name||a.name||''));
const tk=(await api('GET','/desk/tickets/'+R.P23b.ticket.id)).j?.data||{};o.P23bTicketSkillKeys=Object.keys(tk).filter(k=>/skill/i.test(k));
return o;
