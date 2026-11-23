const inv=JSON.parse(fs.readFileSync('../out/inv-desk.json','utf8'));const o={};const all=arr((await api('GET','/desk/departments?limit=500')).j?.data);
for(const [id,n] of inv.cfg.departments){if(!all.find(x=>x.id===id))continue;const g=(await api('GET','/desk/departments/'+id)).j?.data;const d=g?.department||g;
 const p=await api('PATCH','/desk/departments/'+id,{name:d.name,agent_user_ids:[],view_only_agent_user_ids:[],email_addresses:[]});
 const x=await api('DELETE','/desk/departments/'+id);o[n]='patch '+p.s+(p.s>=300?' '+String(p.t).slice(60,180):'')+' | delete '+x.s+(x.s>=300?' '+String(x.t).slice(60,200):'');}
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CLEANUP desk departments: '+JSON.stringify(o).slice(0,600)+'\n');return o;
