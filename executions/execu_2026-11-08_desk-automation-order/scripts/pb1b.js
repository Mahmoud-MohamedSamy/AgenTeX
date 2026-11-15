// Part B batch 1, rerun of the rows the first pass could not run: skills borrowed from QA AS6 sk1 (A1) / sk2 (A2) and restored; FieldUpdate with stringValue; RR method 'load'.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const orig=await notif();const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const sl=(await api('GET','/desk/skills?department_id='+DA)).j?.data;const SL=Array.isArray(sl)?sl:(sl?.skills||[]);
const S1=SL.find(s=>s.name==='QA AS6 sk1'),S2=SL.find(s=>s.name==='QA AS6 sk2');const O1=JSON.parse(JSON.stringify(S1)),O2=JSON.parse(JSON.stringify(S2));fs.writeFileSync('../pb-skill-orig.json',JSON.stringify([O1,O2]));
const setSk=(s,conds,pattern)=>api('PUT','/desk/skills/'+s.id+'?department_id='+DA,{name:s.name,type_id:s.type_id,description:s.description,is_active:true,criteria:{conditions:conds,pattern:pattern||null},agent_ids:s.agent_ids});
const restore=async()=>[(await api('PUT','/desk/skills/'+O1.id+'?department_id='+DA,{name:O1.name,type_id:O1.type_id,description:O1.description,is_active:O1.is_active,criteria:O1.criteria,agent_ids:O1.agent_ids})).s,(await api('PUT','/desk/skills/'+O2.id+'?department_id='+DA,{name:O2.name,type_id:O2.type_id,description:O2.description,is_active:O2.is_active,criteria:O2.criteria,agent_ids:O2.agent_ids})).s];
const dc=k=>({field_key:'description',operator:'contains',value:k});
try{
await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});R.presence=await presence();R.skills=S1.name+'→'+S1.agent_ids.map(nm)+' / '+S2.name+'→'+S2.agent_ids.map(nm);
await cs(R,'OR-01/H-12 skill then skill RR',async()=>{const k='PB01'+U;R.put1=(await setSk(S2,[dc(k)])).s;const rr=await prule('round_robin','PB01 rr',[{criteria:crit(k),method:'skill',pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}],{on:['create','update']});
 const id=await ptk(k);const o=await waitRec(id,x=>x.owner);const out={owner:nm(o.owner),skills:await skillsOf(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-02 skill › workflow',async()=>{const k='PB02'+U;await setSk(S2,[dc(k)]);
 await wrule('OR02id',{kind:'RecordCreated'},wand(wcon(k),{kind:'Membership',field:'skills',negate:false,values:[{kind:'string',stringValue:S2.id}]}),[{type:'AddTicketComment',commentBody:'QA OR-02 id match',commentIsPublic:false}]);
 await wrule('OR02nm',{kind:'RecordCreated'},wand(wcon(k),{kind:'StringMatch',field:'skills',operator:'Contains',stringValue:'sk2',caseInsensitive:true}),[{type:'AddTicketComment',commentBody:'QA OR-02 name match',commentIsPublic:false}]);
 const id=await ptk(k);await sleep(15000);return {skills:await skillsOf(id),execs:await execsOf(id),feed:await feedS(id)};});
await cs(R,'OR-03 workflow sets the field a skill needs',async()=>{const k='PB03'+U;R.put3=(await setSk(S1,[dc(k),{field_key:'priority',operator:'equals',value:'low'}],'1 and 2')).s;
 await wrule('OR03',{kind:'RecordCreated'},wcon(k),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'low'}}}]);
 const rr=await prule('round_robin','PB03 rr',[{criteria:crit(k),method:'skill',pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}],{on:['create','update']});
 const id=await ptk(k);await sleep(15000);const o=await rec(id);const out={priority:o.priority,skills:await skillsOf(id),owner:nm(o.owner),execs:await execsOf(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-11 workflow sets the field RR needs',async()=>{const k='PB11'+U;const rr=await prule('round_robin','PB11 rr',[rrT(k,'sequential',[A1,A2,A3],[{field_key:'priority',operator:'equals',value:'low'}])],{on:['create','update']});
 await wrule('OR11',{kind:'RecordCreated'},wcon(k),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'low'}}}]);
 const id=await ptk(k);await sleep(15000);const o=await rec(id);const out={priority:o.priority,owner:nm(o.owner),execs:await execsOf(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-15/E-15 two RR rules match',async()=>{const k='PB15'+U;const r1=await prule('round_robin','PB15 first seq A1',[rrT(k,'sequential',[A1])],{on:['create','update']});const r2=await prule('round_robin','PB15 second load A3',[rrT(k,'load',[A3])],{on:['create','update']});
 const a=await ptk(k+' a');const oa=await waitRec(a,x=>x.owner);
 const L=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[];const ord=L.map(x=>({id:x.id,version:x.version}));const i1=ord.findIndex(x=>x.id===r1.id),i2=ord.findIndex(x=>x.id===r2.id);const re=[...ord];[re[i1],re[i2]]=[re[i2],re[i1]];
 const p=await api('PUT','/desk/assignment-rules/order',{type:'round_robin',department_id:DA,rules:re});
 const b=await ptk(k+' b');const ob=await waitRec(b,x=>x.owner);const out={before:nm(oa.owner),reorder:E(p),after:nm(ob.owner),feedA:await feedS(a),feedB:await feedS(b)};
 const L2=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[];const back=L2.map(x=>({id:x.id,version:x.version}));const j1=back.findIndex(x=>x.id===r1.id),j2=back.findIndex(x=>x.id===r2.id);[back[j1],back[j2]]=[back[j2],back[j1]];out.reorderBack=(await api('PUT','/desk/assignment-rules/order',{type:'round_robin',department_id:DA,rules:back})).s;
 await off(r1.id,r2.id);return out;});
await cs(R,'OR-28 skill › direct criteria',async()=>{const k='PB28'+U;await setSk(S2,[dc(k)]);
 const d=await prule('direct','PB28 d',[{criteria:{conditions:[dc(k),{field_key:'skills',operator:'contains',value:S2.name}],pattern:'1 and 2'},coming_to_department_id:DA,move_to_department_id:null,assign:ag(A3)}]);
 const id=await ptk(k);await sleep(15000);const out={skills:await skillsOf(id),owner:await own(id),feed:await feedS(id)};await off(d.id);return out;});
}finally{R.skillRestore=await restore();R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchNow=(await notif()).direct_rules_enabled;}
fs.writeFileSync('../pb1b-result.json',JSON.stringify(R,null,1));return R;
