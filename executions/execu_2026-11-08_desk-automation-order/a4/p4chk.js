const R=JSON.parse(fs.readFileSync('../a4/p2.json','utf8'));const g=(await api('GET','/workflow/rules/'+R.P7mix.rule.id)).j?.data;
const p4=(await api('GET','/workflow/rules/'+R.P4.rule.id)).j?.data;
const r=await api('POST','/workflow/rules',{moduleId:T,departmentIds:[D],name:'QA AO WF P4dir',isActive:false,mode:'Recurring',trigger:{kind:'TicketEvent',ticketEvents:{events:['private_thread'],privateThreads:'incoming',privateThread:'incoming',direction:'incoming'}},criteria:guard('QA AO WF P4dir '),actions:[{order:0,type:'AddTicketComment',commentBody:'x',commentPublic:false}]});
if(r.j?.data?.id)track('rule',r.j.data.id,'P4dir');
return {mix:JSON.stringify(g?.trigger),p4:JSON.stringify(p4?.trigger?.ticketEvents),dirSave:r.s,dirStored:JSON.stringify(r.j?.data?.trigger?.ticketEvents)};
