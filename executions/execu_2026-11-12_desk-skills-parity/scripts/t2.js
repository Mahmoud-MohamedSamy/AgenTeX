const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', A1='876ce871-2b02-4854-89a7-68050391c62b', A2='d23fb4e0-248d-41f6-af60-d28885a7007e';
const o={};
const p=await api('PATCH',`/desk/departments/${D}`,{name:'QA SK12 Dept A',agent_user_ids:[A1,A2]}); o.patch=[p.s,p.t.slice(0,200)];
const g=await api('GET',`/desk/departments/${D}`); o.agents=g.j?.data?.agent_user_ids;
return o;
