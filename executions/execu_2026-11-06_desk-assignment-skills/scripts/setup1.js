eval(require('fs').readFileSync('lib.js','utf8'));
const O='97be04b6-0a08-4883-aa51-e1650b11cab7',A1='876ce871-2b02-4854-89a7-68050391c62b',A2='d23fb4e0-248d-41f6-af60-d28885a7007e',A3='5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4',AG='9d182dfa-05f3-4af7-9685-8615a2fbe537';
Object.assign(IDS,{O,A1,A2,A3,AG}); const out={};
for(const [k,name,ag] of [['DA','QA AS6 Dept A',[O,A1,A2,A3]],['DB','QA AS6 Dept B',[O,A1]]]){
 if(IDS[k]) continue; let r=await api('POST','/desk/departments',{name,agent_user_ids:ag,visibility:'public'}); out[k]=sh(r);
 const id=r.j&&r.j.data&&r.j.data.id; if(id){IDS[k]=id;LED('department "'+name+'" '+id);
  const g=(await api('GET','/desk/departments/'+id)).j.data; out[k+'agents']=g.agent_user_ids;
  if(!(g.agent_user_ids||[]).includes(A1)){ const p=await api('PUT','/desk/departments/'+id,{...g,agent_user_ids:ag}); out[k+'put']=sh(p);} } }
if(!IDS.TA&&IDS.DA){const r=await api('POST','/desk/teams',{name:'QA AS6 Team A',department_id:IDS.DA,sources:[{kind:'agent',ref_id:A2},{kind:'agent',ref_id:A3}]});out.team=sh(r);const id=r.j&&r.j.data&&(r.j.data.id||(r.j.data.team&&r.j.data.team.id));if(id){IDS.TA=id;LED('team "QA AS6 Team A" '+id);}}
saveIds(); for(const k of ['DA','DB']) if(IDS[k]) out[k+'final']=(await api('GET','/desk/departments/'+IDS[k])).j.data.agent_user_ids;
out.ids=IDS; return out;
