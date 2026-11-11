const R=JSON.parse(fs.readFileSync('../a4/p1.json','utf8'));const o={};
o.P24err=R.P24.rule.err;
const t18=(await api('GET','/desk/tickets/'+R.P18.ticket.id)).j?.data||{};o.P18keys=Object.keys(t18).filter(k=>/follow|watch|subscr/i.test(k)).map(k=>k+'='+JSON.stringify(t18[k]));
const f=await api('GET','/desk/tickets/'+R.P18.ticket.id+'/followers');o.P18followers=[f.s,JSON.stringify(f.j?.data).slice(0,200)];
const t23=await getTicket(R.P23a.ticket.id);o.P23aSkills=t23.skills;const tk23=(await api('GET','/desk/tickets/'+R.P23a.ticket.id)).j?.data||{};o.P23aKeys=Object.keys(tk23).filter(k=>/skill/i.test(k)).map(k=>k+'='+JSON.stringify(tk23[k]));
const sk=await api('GET','/desk/tickets/'+R.P23a.ticket.id+'/skills');o.P23aSkillsApi=[sk.s,JSON.stringify(sk.j?.data).slice(0,200)];
const cm=(await api('GET','/desk/tickets/'+R.P14a.ticket.id+'/comments')).j?.data;o.cm=JSON.stringify(cm).slice(0,400);
const ex=(await api('GET','/workflow/executions?recordId='+R.P23a.ticket.id)).j?.data;o.ex23=JSON.stringify(ex).slice(0,900);
return o;
