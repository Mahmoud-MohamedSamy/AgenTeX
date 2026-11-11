// NDC-2824: agent threshold in QA AS6 Dept A counts tickets from all departments? Threshold for A1/A2/A3 = (A3's open in this dept + 2). Restores prefs.
const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',T='88e8ea44-1658-4df3-9930-d0902b91073d';const m=JSON.parse(fs.readFileSync('../ar1-made.json','utf8'));
const A1='876ce871-2b02-4854-89a7-68050391c62b',A2='d23fb4e0-248d-41f6-af60-d28885a7007e',A3='5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4';const N={[A1]:'A1',[A2]:'A2',[A3]:'A3'};
const R={};const wl=async id=>{const d=(await api('GET','/desk/agents/'+id+'/workload')).j?.data?.departments||[];return {dept:d.find(x=>x.department_id===D)?.open_tickets,all:d.reduce((s,x)=>s+(x.open_tickets||0),0)};};
R.A3=await wl(A3);R.A1=await wl(A1);
const prefs=(await api('GET','/desk/departments/'+D+'/round-robin-preferences')).j?.data;R.prefsBefore=JSON.stringify(prefs).slice(0,300);
const th=R.A3.dept+2;R.threshold=th;
const put=await api('PUT','/desk/departments/'+D+'/round-robin-preferences',{...prefs,agent_threshold_enabled:true,agent_thresholds:[{user_id:A3,threshold:th}]});R.put=put.s+(put.s>=300?' '+put.t.slice(0,250):'');
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});R.owners=[];
for(let i=1;i<=3;i++){const r=await api('POST','/modules/'+T+'/records',{data:[f('subject','QA AO 2824 '+i),f('description','QA AO AOLOADdwbf 2824 '+i),f('department',D),f('status','Open'),f('priority','high'),{field:'owner',value:{kind:'null'}}]});const id=r.j?.data?.id;m.tickets.push(id);await sleep(5000);
 const v=((await api('GET','/modules/'+T+'/records/'+id)).j?.data?.data||[]).find(x=>x.field==='owner')?.value?.value;R.owners.push(N[v]||(v?String(v).slice(0,8):'none'));}
R.restore=(await api('PUT','/desk/departments/'+D+'/round-robin-preferences',prefs)).s;
fs.writeFileSync('../ar1-made.json',JSON.stringify(m));return R;
