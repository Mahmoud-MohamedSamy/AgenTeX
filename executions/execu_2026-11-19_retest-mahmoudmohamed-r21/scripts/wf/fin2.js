eval(fs.readFileSync('wf/lib.js','utf8'));const o={};
for(const id of [CFG.D,CFG.DB]){const g=(await api('GET','/desk/departments/'+id)).j?.data;const p=await api('PUT',`/desk/departments/${id}/agents`,{agent_user_ids:[]});o[g.name]=p.s+' '+p.t.slice(0,160);const n=(await api('GET','/desk/departments/'+id)).j?.data;o[g.name+' now']=n.agent_user_ids;if(p.s<300&&!n.agent_user_ids.length)led(`department "${g.name}" ${id}: agents removed (was ${JSON.stringify(g.agent_user_ids)})`);}
return o;
