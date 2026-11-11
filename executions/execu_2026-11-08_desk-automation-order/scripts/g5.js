// G-05: AS6 Dept A "new ticket" alert on, create unassigned ticket, switch back off.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const K='department.ticket_created';const j=JSON.parse(fs.readFileSync('../g.json','utf8'));
R.on=(await api('PUT','/desk/notification-rules/departments/'+DA+'/rules/'+K,{is_enabled:true,template_id:null})).s;
const t=await tk('AOG5'+U);await sleep(10000);j.g5=t;j.n5=(await rec(t)).ticket_number;R.owner=await own(t);
R.off=(await api('PUT','/desk/notification-rules/departments/'+DA+'/rules/'+K,{is_enabled:false,template_id:null})).s;
R.after=((await api('GET','/desk/notification-rules/departments/'+DA)).j?.data?.rules||[]).find(x=>x.key===K)?.is_enabled;
fs.writeFileSync('../g.json',JSON.stringify(j));R.n5=j.n5;return R;
