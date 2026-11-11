const R=JSON.parse(fs.readFileSync('../a4/p1.json','utf8'));const id=R.P18.ticket.id;const o={};
for(const b of [{user_ids:[SAMY]},{user_id:SAMY},{follower_user_ids:[SAMY]}]){const r=await api('POST','/desk/tickets/'+id+'/followers',b);o[Object.keys(b)[0]]=[r.s,r.t.slice(0,250)];if(r.s<300)break;}
const f=await api('GET','/desk/tickets/'+id+'/followers');o.after=JSON.stringify(f.j?.data).slice(0,300);
const d=(await api('GET','/desk/departments/'+D)).j?.data||{};o.deptKeys=Object.keys(d).join(',');o.member=JSON.stringify(d).includes(SAMY);
return o;
