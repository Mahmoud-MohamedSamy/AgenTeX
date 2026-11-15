eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const orig=await notif();const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const sl=(await api('GET','/desk/skills?department_id='+DA)).j?.data;const SL=Array.isArray(sl)?sl:(sl?.skills||[]);const S2=SL.find(s=>s.name==='QA AS6 sk2');const SO=JSON.parse(fs.readFileSync('../pb-skill-orig.json','utf8'));
try{await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});
 for(const tag of ['e1','e2']){await cs(R,tag+' direct move + skill + skill RR',async()=>{const k='PC5'+tag+U;
  await api('PUT','/desk/skills/'+S2.id+'?department_id='+DA,{name:S2.name,type_id:S2.type_id,description:S2.description,is_active:true,criteria:{conditions:[{field_key:'description',operator:'contains',value:k}],pattern:null},agent_ids:S2.agent_ids});
  const d=await prule('direct','PC5 '+tag+' d',[daT(k,{kind:'unassigned',user_id:null,team_id:null},{coming:DB,move:DA})]);
  const rr=await prule('round_robin','PC5 '+tag+' rr',[{criteria:crit(k),method:'skill',pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}],{on:['create']});
  const id=await ptk(k,{},DB);const o=await waitRec(id,x=>x.owner,24);await sleep(4000);const r=await rec(id);await off(d.id,rr.id);return {num:r.ticket_number,owner:nm(o.owner),skills:await skillsOf(id),feed:await feedS(id)};});}
 await cs(R,'e3 same skill RR, created directly in Dept A (no move)',async()=>{const k='PC5e3'+U;
  await api('PUT','/desk/skills/'+S2.id+'?department_id='+DA,{name:S2.name,type_id:S2.type_id,description:S2.description,is_active:true,criteria:{conditions:[{field_key:'description',operator:'contains',value:k}],pattern:null},agent_ids:S2.agent_ids});
  const rr=await prule('round_robin','PC5 e3 rr',[{criteria:crit(k),method:'skill',pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}],{on:['create']});
  const id=await ptk(k);const o=await waitRec(id,x=>x.owner,24);await sleep(4000);const r=await rec(id);await off(rr.id);return {num:r.ticket_number,owner:nm(o.owner),feed:await feedS(id)};});
}finally{R.switch=(await api('PUT','/desk/assignment/notification-settings',orig)).s;const o=[];for(const x of SO)o.push((await api('PUT','/desk/skills/'+x.id+'?department_id='+DA,{name:x.name,type_id:x.type_id,description:x.description,is_active:x.is_active,criteria:x.criteria,agent_ids:x.agent_ids})).s);R.skillRestore=o;}
fs.writeFileSync('../pc5c-result.json',JSON.stringify(R,null,1));return R;
