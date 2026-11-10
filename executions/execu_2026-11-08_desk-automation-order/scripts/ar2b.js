const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';const R={};
for(const [n,id] of [['A1','876ce871-2b02-4854-89a7-68050391c62b'],['A2','d23fb4e0-248d-41f6-af60-d28885a7007e'],['A3','5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4']]){const d=(await api('GET','/desk/agents/'+id+'/workload')).j?.data;R[n]={keys:Object.keys(d||{}).join(','),total:JSON.stringify(Object.fromEntries(Object.entries(d||{}).filter(([k])=>k!=='departments'))).slice(0,160),dept:JSON.stringify((d?.departments||[]).find(x=>x.department_id===D)).slice(0,200),ndept:(d?.departments||[]).length};}
return R;
