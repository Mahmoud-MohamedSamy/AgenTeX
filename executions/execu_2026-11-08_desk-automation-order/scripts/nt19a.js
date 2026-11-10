// NT-19 with round robin. MODE=off|on: sets notify_agent_on_assignment, creates 3 RR tickets (one per agent), saves numbers. Restores the original setting when MODE=restore.
const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',T='88e8ea44-1658-4df3-9930-d0902b91073d';const m=JSON.parse(fs.readFileSync('../ar1-made.json','utf8'));
const MODE=process.env.MODE;const R={MODE};const cur=(await api('GET','/desk/assignment/notification-settings')).j?.data;R.before=cur;
if(!fs.existsSync('../nt19-orig.json'))fs.writeFileSync('../nt19-orig.json',JSON.stringify(cur));
if(MODE==='restore'){const o=JSON.parse(fs.readFileSync('../nt19-orig.json','utf8'));R.put=(await api('PUT','/desk/assignment/notification-settings',o)).s;R.after=(await api('GET','/desk/assignment/notification-settings')).j?.data;return R;}
R.put=(await api('PUT','/desk/assignment/notification-settings',{...cur,notify_agent_on_assignment:MODE==='on'})).s+'';R.after=(await api('GET','/desk/assignment/notification-settings')).j?.data;
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const N={'876ce871-2b02-4854-89a7-68050391c62b':'A1','d23fb4e0-248d-41f6-af60-d28885a7007e':'A2','5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4':'A3'};
R.tickets=[];for(let i=1;i<=3;i++){const r=await api('POST','/modules/'+T+'/records',{data:[f('subject','QA AO NT19'+MODE+' '+i),f('description','QA AO AOSEQdwbf NT19'+MODE+' '+i),f('department',D),f('status','Open'),f('priority','high'),{field:'owner',value:{kind:'null'}}]});const id=r.j?.data?.id;m.tickets.push(id);await sleep(5000);
 const d=(await api('GET','/modules/'+T+'/records/'+id)).j?.data;const v=(d?.data||[]).find(x=>x.field==='owner')?.value?.value;const num=(d?.data||[]).find(x=>/ticket_number|number/.test(x.field))?.value?.value;R.tickets.push({id,num,owner:N[v]||v});}
fs.writeFileSync('../ar1-made.json',JSON.stringify(m));fs.writeFileSync('../nt19-'+MODE+'.json',JSON.stringify(R.tickets));return R;
