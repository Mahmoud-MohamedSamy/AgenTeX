// Part B batch 1: Skills / Direct / Workflow / Round robin pairs (OR-01..06, 10..12, 15, 28; H-12, D-15, D-16, D-17, E-15).
// Direct switch turned on for the batch and restored after (same as 10 Nov runs). Rules made inactive at the end of each case.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const orig=await notif();if(!fs.existsSync('../pb-switch-orig.json'))fs.writeFileSync('../pb-switch-orig.json',JSON.stringify(orig));
const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const woff=async(...ids)=>{for(const id of ids)try{await api('DELETE','/workflow/rules/'+id);}catch(e){}};
try{
await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});R.switchOn=(await notif()).direct_rules_enabled;
R.presence=await presence();
await cs(R,'OR-01/H-12 skill then skill RR',async()=>{const k='PB01'+U;const sk=await pskill('s01',k,[A2]);const rr=await prule('round_robin','PB01 rr',[{criteria:crit(k),method:'skill',pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}],{on:['create','update']});
 const id=await ptk(k);const o=await waitRec(id,x=>x.owner);const out={owner:nm(o.owner),skills:await skillsOf(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-02 skill › workflow',async()=>{const k='PB02'+U;const sk=await pskill('s02',k,[A2]);
 const w=await wrule('OR02',{kind:'RecordCreated'},wand(wcon(k),{kind:'Membership',field:'skills',negate:false,values:[{kind:'string',stringValue:sk.id}]}),[{type:'AddTicketComment',commentBody:'QA OR-02 workflow saw the skill',commentIsPublic:false}]);
 const w2=await wrule('OR02n',{kind:'RecordCreated'},wand(wcon(k),{kind:'StringMatch',field:'skills',operator:'Contains',stringValue:sk.name,caseInsensitive:false}),[{type:'AddTicketComment',commentBody:'QA OR-02 name match',commentIsPublic:false}]);
 const id=await ptk(k);await sleep(15000);return {skills:await skillsOf(id),execs:await execsOf(id)};});
await cs(R,'OR-03 workflow sets field a skill needs',async()=>{const k='PB03'+U;const ty=(await api('GET','/desk/skill-types?department_id='+DA)).j?.data?.types||[];
 const r=await api('POST','/desk/skills?department_id='+DA,{name:'QA AO PB s03 '+U,type_id:ty[0]?.id,description:'QA',is_active:true,criteria:{conditions:[{field_key:'description',operator:'contains',value:k},{field_key:'priority',operator:'equals',value:'low'}],pattern:'1 and 2'},agent_ids:[A3],department_id:DA});const sid=r.j?.data?.id;if(sid){pbm.skills.push(sid);pbSave();}
 const w=await wrule('OR03',{kind:'RecordCreated'},wcon(k),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'low'}}}]);
 const rr=await prule('round_robin','PB03 rr',[{criteria:crit(k),method:'skill',pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}],{on:['create','update']});
 const id=await ptk(k);await sleep(15000);const o=await rec(id);const out={skill:r.s,priority:o.priority,skills:await skillsOf(id),owner:nm(o.owner),execs:await execsOf(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-04/D-15 direct › workflow condition owner',async()=>{const k='PB04'+U;const d=await prule('direct','PB04 d',[daT(k,ag(A1))]);
 await wrule('OR04',{kind:'RecordCreated'},wand(wcon(k),{kind:'Comparison',field:'owner',operator:'Equal',value:{kind:'string',stringValue:A1}}),[{type:'AddTicketComment',commentBody:'QA OR-04 owner is A1',commentIsPublic:false}]);
 await wrule('OR04u',{kind:'RecordUpdated'},wand(wcon(k),{kind:'Comparison',field:'owner',operator:'Equal',value:{kind:'string',stringValue:A1}}),[{type:'AddTicketComment',commentBody:'QA OR-04 update rule',commentIsPublic:false}]);
 const id=await ptk(k);await sleep(15000);const out={owner:await own(id),execs:await execsOf(id),feed:await feedS(id)};await off(d.id);return out;});
await cs(R,'OR-05/D-16 direct A1 then workflow A2',async()=>{const k='PB05'+U;const d=await prule('direct','PB05 d',[daT(k,ag(A1))]);
 await wrule('OR05',{kind:'RecordCreated'},wcon(k),[{type:'OwnerAssignment',ownerTargetKind:'SpecificUser',ownerValue:A2}]);
 const id=await ptk(k);await sleep(15000);const o=await rec(id);const out={owner:nm(o.owner),num:o.ticket_number,execs:await execsOf(id),feed:await feedS(id)};await off(d.id);fs.writeFileSync('../pb-or05.json',JSON.stringify({id,num:o.ticket_number}));return out;});
await cs(R,'OR-06 direct A1 then workflow email to owner',async()=>{const k='PB06'+U;const d=await prule('direct','PB06 d',[daT(k,ag(A1))]);
 const TL=(await api('GET','/desk/email-templates?limit=200')).j?.data;const tl=Array.isArray(TL)?TL:(TL?.items||TL?.templates||[]);const tpl=tl.find(t=>/workflow|custom|general/i.test(t.use_case||''))||tl.find(t=>t.notification_type==='agent');
 await wrule('OR06',{kind:'RecordCreated'},wcon(k),[{type:'Email',emailRecipients:[{kind:'userfield',value:'owner'}],emailTemplateId:tpl?.id,emailSubject:'QA OR-06 '+k,emailBody:'QA OR-06'}]);
 const id=await ptk(k);await sleep(20000);const j=(await api('GET','/workflow/executions?recordId='+id)).j?.data;const L=Array.isArray(j)?j:(j?.items||[]);
 const out={owner:await own(id),tpl:tpl?.name,execs:await execsOf(id),dispatch:JSON.stringify(L[0]?.dispatches||L[0]?.actions||L[0]||'').slice(0,700)};await off(d.id);return out;});
await cs(R,'OR-10/D-17 workflow sets owner, RR also matches',async()=>{const k='PB10'+U;const rr=await prule('round_robin','PB10 rr',[rrT(k,'sequential')],{on:['create','update']});
 await wrule('OR10',{kind:'RecordCreated'},wcon(k),[{type:'OwnerAssignment',ownerTargetKind:'SpecificUser',ownerValue:A3}]);
 const id=await ptk(k);await sleep(15000);const out={owner:await own(id),execs:await execsOf(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-11 workflow sets the field RR needs',async()=>{const k='PB11'+U;const rr=await prule('round_robin','PB11 rr',[rrT(k,'sequential',[A1,A2,A3],[{field_key:'priority',operator:'equals',value:'low'}])],{on:['create','update']});
 await wrule('OR11',{kind:'RecordCreated'},wcon(k),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'low'}}}]);
 const id=await ptk(k);await sleep(15000);const o=await rec(id);const out={priority:o.priority,owner:nm(o.owner),execs:await execsOf(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-12 direct moves dept, new dept RR',async()=>{const k='PB12'+U;const d=await prule('direct','PB12 d',[daT(k,{kind:'unassigned',user_id:null,team_id:null},{coming:DB,move:DA})]);const rr=await prule('round_robin','PB12 rr',[rrT(k,'sequential')],{on:['create','update']});
 const id=await ptk(k,{},DB);const o=await waitRec(id,x=>x.owner,24);const out={dept:nm(o.department),owner:nm(o.owner),feed:await feedS(id)};await off(d.id,rr.id);return out;});
await cs(R,'OR-15/E-15 two RR rules match',async()=>{const k='PB15'+U;const r1=await prule('round_robin','PB15 first seq A1',[rrT(k,'sequential',[A1])],{on:['create','update']});const r2=await prule('round_robin','PB15 second lb A3',[rrT(k,'load_balancing',[A3])],{on:['create','update']});
 const a=await ptk(k+' a');const oa=await waitRec(a,x=>x.owner);
 const L=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[];const ord=L.map(x=>({id:x.id,version:x.version}));const i1=ord.findIndex(x=>x.id===r1.id),i2=ord.findIndex(x=>x.id===r2.id);const re=[...ord];[re[i1],re[i2]]=[re[i2],re[i1]];
 const p=await api('PUT','/desk/assignment-rules/order',{type:'round_robin',department_id:DA,rules:re});
 const b=await ptk(k+' b');const ob=await waitRec(b,x=>x.owner);const out={before:nm(oa.owner),reorder:E(p),after:nm(ob.owner),feedA:await feedS(a),feedB:await feedS(b)};
 const L2=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[];const back=L2.map(x=>({id:x.id,version:x.version}));const j1=back.findIndex(x=>x.id===r1.id),j2=back.findIndex(x=>x.id===r2.id);[back[j1],back[j2]]=[back[j2],back[j1]];out.reorderBack=(await api('PUT','/desk/assignment-rules/order',{type:'round_robin',department_id:DA,rules:back})).s;
 await off(r1.id,r2.id);return out;});
await cs(R,'OR-28 skill › direct criteria',async()=>{const k='PB28'+U;const sk=await pskill('s28',k,[A2]);
 const d=await prule('direct','PB28 d',[{criteria:{conditions:[{field_key:'description',operator:'contains',value:k},{field_key:'skills',operator:'contains',value:sk.name}],pattern:'1 and 2'},coming_to_department_id:DA,move_to_department_id:null,assign:ag(A3)}]);
 const id=await ptk(k);await sleep(15000);const out={skills:await skillsOf(id),owner:await own(id),feed:await feedS(id)};await off(d.id);return out;});
}finally{R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchNow=(await notif()).direct_rules_enabled;}
fs.writeFileSync('../pb1-result.json',JSON.stringify(R,null,1));return R;
