// Debug E-14b (skill held by A3 only) and H-09 with no skills. Restores the borrowed skill.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const q='department_id='+DA;
const list=async()=>{const s=(await api('GET','/desk/skills?'+q)).j?.data;return Array.isArray(s)?s:(s?.skills||[]);};
const L0=await list();const s=L0.filter(x=>x.is_active&&/^QA AS6/.test(x.name)&&!/img/.test(x.name))[5];const save={name:s.name,type_id:s.type_id,description:s.description,is_active:s.is_active,criteria:s.criteria};const ag0=s.agent_ids;
const k='AOE14c'+U;
try{
 R.skill=s.name+' agents before '+ag0.map(nm).join(',');
 R.put=(await api('PUT','/desk/skills/'+s.id,{...save,criteria:{conditions:[{field_key:'description',operator:'contains',value:k}],pattern:null}})).s;
 R.agentsPut=E(await api('PUT','/desk/skills/'+s.id+'/agents',{user_ids:[A3]}));
 R.agentsNow=(await list()).find(x=>x.id===s.id)?.agent_ids.map(nm).join(',');
 const as=(await api('GET','/desk/agent-skills?'+q)).t.slice(0,300);R.agentSkillsSample=as;
 const r=await rule('round_robin','E14c',[rrT(k,'skill')]);
 R.tickets=[];for(let i=1;i<=3;i++){const t=await tk(k+' '+i);const o=await waitOwn(t,16);const f=(await feed(t)).find(e=>e.action==='ticket.auto_assigned');R.tickets.push(o+' skills='+JSON.stringify((await rec(t)).skills)+' '+JSON.stringify(f?.summary||{}).slice(0,250));}
 await setA(r.j.data.id,false);
 const t0=await tk('AOH09none'+U);await sleep(4000);const b=await api('POST','/desk/tickets/'+t0+'/skills/assign',{});R.h09none=b.s+' '+b.t.slice(0,250)+' owner '+(await own(t0));
}finally{R.restore=(await api('PUT','/desk/skills/'+s.id,save)).s+'/'+(await api('PUT','/desk/skills/'+s.id+'/agents',{user_ids:ag0})).s;}
return R;
