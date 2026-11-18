eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/sk/lib.js','utf8'));
const R={};
if(!I.TYPE){const r=await api('POST','/desk/skill-types?department_id='+D,{department_id:D,name:'QA RT19 SK Type'});R.type=E(r)+' '+r.t.slice(0,300);const id=r.j?.data?.id||r.j?.data?.type?.id;if(id){I.TYPE=id;saveI();LED('skill type created '+id+' "QA RT19 SK Type" dept QA RT19 SK Dept');}}
if(!I.TYPE)return R;
const L='QA RT19 SK Long '+'W'.repeat(60);
const mk=async(key,name,active,agents)=>{if(I[key])return;const r=await api('POST','/desk/skills?department_id='+D,{department_id:D,name,type_id:I.TYPE,description:'QA RT19 SK lane',is_active:true,criteria:{conditions:[{field_key:'subject',operator:'contains',value:'QART19SKNEVER'}],pattern:null}});
 const id=r.j?.data?.id||r.j?.data?.skill?.id;R[key]=E(r);if(!id)return;I[key]=id;saveI();LED('skill created '+id+' "'+name+'" dept QA RT19 SK Dept');
 if(agents.length)R[key+' agents']=E(await api('PUT','/desk/skills/'+id+'/agents',{user_ids:agents}));
 if(!active){const g=(await api('GET','/desk/skills?department_id='+D)).j?.data?.skills.find(s=>s.id===id);const p=await api('PUT','/desk/skills/'+id,{...g,is_active:false});R[key+' deact']=E(p);if(p.s<300)LED('skill '+id+' "'+name+'" set inactive');}};
await mk('S1','QA RT19 SK S1',true,[A1]);await mk('S2','QA RT19 SK S2',true,[A3]);await mk('S3','QA RT19 SK S3',true,[]);await mk('IN','QA RT19 SK Inact',false,[]);await mk('DEL','QA RT19 SK Del',true,[A1]);await mk('LONG',L,true,[]);
R.list=((await api('GET','/desk/skills?department_id='+D)).j?.data?.skills||[]).map(s=>s.name.slice(0,40)+' act='+s.is_active+' ag='+(s.agent_ids||[]).map(nm));
return R;
