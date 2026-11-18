const TM='88e8ea44-1658-4df3-9930-d0902b91073d';
let r=await api('GET','/modules/'+TM+'/record-visibility'); log('vis',r.s,r.t.slice(0,300));
r=await api('GET','/desk/ticket-access/settings'); log('ta',r.s,r.t.slice(0,400));
r=await api('GET','/iam/users/876ce871-2b02-4854-89a7-68050391c62b'); log('D',r.s,r.t.slice(0,600));
r=await api('GET','/desk/departments/7e1ac409-58b0-41ab-97e1-0e7d5c8c5158/agents'); log('cs',r.s,r.t.slice(0,800));
