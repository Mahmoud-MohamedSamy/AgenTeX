const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', S1='07eb6b9e-229c-4970-846c-45d56d47d16a';
const o={};
for(const [m,p,b] of [['GET',`/desk/skills?department_id=${D}`],['POST',`/desk/skills?department_id=${D}`,{name:'QA SK12 AgentTry',type_id:'81b2c9de-b75c-412b-ad6a-eab6c787de82',is_active:true,criteria:null}],['PUT',`/desk/skill-preferences?department_id=${D}`,{auto_add:true,placement:'bottom'}],['DELETE',`/desk/skills/${S1}`],['POST','/desk/skills/recalculations',{}]]){
 const r=await api(m,p,b); o[m+' '+p.split('?')[0]]=[r.s,r.t.slice(0,160)]; if(r.s===201&&r.j?.data?.id) track('skill',r.j.data.id,'QA SK12 AgentTry (agent!)'); }
return o;
