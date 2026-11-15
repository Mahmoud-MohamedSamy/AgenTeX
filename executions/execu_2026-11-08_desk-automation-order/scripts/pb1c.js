// OR-02 diagnosis (skill condition on create vs on update), OR-03, OR-11 rerun.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const sl=(await api('GET','/desk/skills?department_id='+DA)).j?.data;const SL=Array.isArray(sl)?sl:(sl?.skills||[]);
const S1=SL.find(s=>s.name==='QA AS6 sk1'),S2=SL.find(s=>s.name==='QA AS6 sk2');const SO=JSON.parse(fs.readFileSync('../pb-skill-orig.json','utf8'));
const setSk=(s,conds,pattern)=>api('PUT','/desk/skills/'+s.id+'?department_id='+DA,{name:s.name,type_id:s.type_id,description:s.description,is_active:true,criteria:{conditions:conds,pattern:pattern||null},agent_ids:s.agent_ids});
const restore=async()=>{const o=[];for(const x of SO)o.push((await api('PUT','/desk/skills/'+x.id+'?department_id='+DA,{name:x.name,type_id:x.type_id,description:x.description,is_active:x.is_active,criteria:x.criteria,agent_ids:x.agent_ids})).s);return o;};
const dc=k=>({field_key:'description',operator:'contains',value:k});
try{
await cs(R,'OR-02 skill › workflow (create, update, control)',async()=>{const k='PB2b'+U;await setSk(S2,[dc(k)]);
 await wrule('OR02c id',{kind:'RecordCreated'},wand(wcon(k),{kind:'Membership',field:'skills',negate:false,values:[{kind:'string',stringValue:S2.id}]}),[{type:'AddTicketComment',commentBody:'QA OR-02 create id',commentIsPublic:false}]);
 await wrule('OR02c nm',{kind:'RecordCreated'},wand(wcon(k),{kind:'Membership',field:'skills',negate:false,values:[{kind:'string',stringValue:S2.name}]}),[{type:'AddTicketComment',commentBody:'QA OR-02 create name',commentIsPublic:false}]);
 await wrule('OR02c ctl',{kind:'RecordCreated'},wcon(k),[{type:'AddTicketComment',commentBody:'QA OR-02 control',commentIsPublic:false}]);
 await wrule('OR02u id',{kind:'RecordUpdated'},wand(wcon(k),{kind:'Membership',field:'skills',negate:false,values:[{kind:'string',stringValue:S2.id}]}),[{type:'AddTicketComment',commentBody:'QA OR-02 update id',commentIsPublic:false}]);
 await wrule('OR02u nm',{kind:'RecordUpdated'},wand(wcon(k),{kind:'Membership',field:'skills',negate:false,values:[{kind:'string',stringValue:S2.name}]}),[{type:'AddTicketComment',commentBody:'QA OR-02 update name',commentIsPublic:false}]);
 const id=await ptk(k);await sleep(15000);const onCreate=await execsOf(id);await patch(id,{priority:'medium'});await sleep(15000);
 return {skills:await skillsOf(id),onCreate,afterUpdate:await execsOf(id),feed:await feedS(id)};});
await cs(R,'OR-03 workflow sets the field a skill needs',async()=>{const k='PB03'+U;R.put3=(await setSk(S1,[dc(k),{field_key:'priority',operator:'equals',value:'low'}],'1 and 2')).s;
 await wrule('OR03',{kind:'RecordCreated'},wcon(k),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'low'}}}]);
 const rr=await prule('round_robin','PB03 rr',[{criteria:crit(k),method:'skill',pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}],{on:['create','update']});
 const id=await ptk(k);await sleep(15000);const o=await rec(id);const out={priority:o.priority,skills:await skillsOf(id),owner:nm(o.owner),execs:await execsOf(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-11 workflow sets the field RR needs',async()=>{const k='PB11'+U;const rr=await prule('round_robin','PB11 rr',[rrT(k,'sequential',[A1,A2,A3],[{field_key:'priority',operator:'equals',value:'low'}])],{on:['create','update']});
 await wrule('OR11',{kind:'RecordCreated'},wcon(k),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'low'}}}]);
 const id=await ptk(k);await sleep(15000);const o=await rec(id);const out={priority:o.priority,owner:nm(o.owner),execs:await execsOf(id),feed:await feedS(id)};await off(rr.id);return out;});
}finally{R.skillRestore=await restore();}
fs.writeFileSync('../pb1c-result.json',JSON.stringify(R,null,1));return R;
