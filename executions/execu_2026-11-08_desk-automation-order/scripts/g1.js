// G-01 (RR → A1), G-03 (direct team target; direct switch on then off, user OK), G-02 prep (unassigned ticket for A1 to pick up), G-05 (dept new-ticket alert) setup. Ids → ../g.json
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const k='AOG'+U;
const r1=await rule('round_robin','G01',[rrT(k+'1','sequential',[A1])]);const g1=await tk(k+'1');R.g1=await waitOwn(g1);
const orig=await notif();let g3;
try{await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});const d=await rule('direct','G03',[daT(k+'3',{kind:'team',user_id:null,team_id:TEAM})]);g3=await tk(k+'3');await sleep(8000);R.g3=await st(g3);await setA(d.j.data.id,false);}
finally{R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchAfter=(await notif()).direct_rules_enabled;}
await setA(r1.j.data.id,false);
const g2=await tk(k+'2');await sleep(6000);R.g2=await own(g2);
// G-05: department "new ticket" alert in AS6 Dept A
const rules=(await api('GET','/desk/notification-rules/departments/'+DA)).j?.data?.rules||[];R.g05keys=rules.filter(x=>/new|unassign|created/.test(x.key)).map(x=>x.key+'='+x.is_enabled);
const nr=rules.find(x=>/agent\.ticket_created|ticket_new|new_ticket/.test(x.key));let g5=null;
if(nr){const was=nr.is_enabled;const p=await api('PUT','/desk/notification-rules/departments/'+DA+'/'+nr.key,{...nr,is_enabled:true});R.g05on=p.s+' '+p.t.slice(0,100);g5=await tk(k+'5');await sleep(8000);if(!was)R.g05off=(await api('PUT','/desk/notification-rules/departments/'+DA+'/'+nr.key,{...nr,is_enabled:false})).s;}
const num=async id=>(await rec(id)).ticket_number;
fs.writeFileSync('../g.json',JSON.stringify({g1,g2,g3,g5,n1:await num(g1),n2:await num(g2),n3:await num(g3),n5:g5?await num(g5):null}));R.nums=JSON.parse(fs.readFileSync('../g.json','utf8'));return R;
