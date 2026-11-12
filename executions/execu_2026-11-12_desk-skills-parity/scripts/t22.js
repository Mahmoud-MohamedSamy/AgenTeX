const HOLD='4853562a-0b4d-45cb-ba34-9f2118fcd32c'; const o={};
for(const id of ['445a654e-c31d-4fa4-a8b0-d430c448b0fc','1379ecd0-cd64-41d1-b795-31d70f8cb4a5']){
 const g=await api('GET',`/desk/departments/${id}`); const name=g.j?.data?.name;
 const p=await api('PATCH',`/desk/departments/${id}`,{name,agent_user_ids:[]});
 let d=await api('DELETE',`/desk/departments/${id}?transfer_to_department_id=${HOLD}`);
 o[id]=[name,p.s,d.s,d.t.slice(0,250)]; }
return o;
