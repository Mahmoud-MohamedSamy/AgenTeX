// 7 Nov: B-01 (no criteria), B-09 (contact / account criteria at runtime), D-04 (direct ignores offline + threshold), A-11 delete keeps owner.
eval(require('fs').readFileSync('lib.js','utf8'));
const AM='784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const mkRec=async(mod,vals,label)=>{const r=await api('POST','/modules/'+mod+'/records',body(vals));const d=r.j&&r.j.data;const id=d&&(d.id||(d.record&&d.record.id));if(id)LED(label+' '+id);return {s:r.s,id,e:E(r)};};
const o={};
// B-01
await cs('B-01',async()=>{const r=await mkRule({type:'direct',name:'QA AS6 B01 no criteria',description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[],pattern:null},coming_to_department_id:IDS.DB,move_to_department_id:null,assign:AG(IDS.A1)}]});IDS.DA_B01=r.id;saveIds();
  const t=await mkTicket('QA AS6 zq any subject B01',IDS.DB,{},'B-01');await W(5000);const w=await own(t.id);
  // A-11: delete the rule, ticket keeps owner
  const g=await getRule(r.id);const del=sh(await api('DELETE','/desk/assignment-rules/'+r.id+'?version='+g.version));if(del.s<300)LED('rule QA AS6 B01 no criteria deleted (A-11)');
  await W(1500);const w2=await own(t.id);const still=await getRule(r.id);
  return {rule:r.s,e:r.e,owner:nm(w.owner),h:(await hist(t.id)).slice(0,3),del:del.s,delE:del.e,ownerAfterDelete:nm(w2.owner),ruleGone:!still};});
// B-09
await cs('B-09',async()=>{
  const ac=await mkRec(AM,{account_name:'QA AS6 Acct B09'},'account QA AS6 Acct B09');
  const ct=await mkRec(CM,{first_name:'Qa',last_name:'QA AS6 B09',email:'qa.as6.b09@example.com',account_id:ac.id},'contact QA AS6 B09');
  const r1=await mkRule({type:'direct',name:'QA AS6 B09 contact',description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'contact.last_name',operator:'equals',value:'QA AS6 B09'}],pattern:null},coming_to_department_id:IDS.DB,move_to_department_id:null,assign:AG(IDS.A2)}]});
  const r2=await mkRule({type:'direct',name:'QA AS6 B09 account',description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'account.account_name',operator:'contains',value:'QA AS6 Acct B09'}],pattern:null},coming_to_department_id:IDS.DB,move_to_department_id:null,assign:AG(IDS.A3)}]});
  IDS.DA_B09c=r1.id;IDS.DA_B09a=r2.id;saveIds();
  const t1=await mkTicket('QA AS6 B09 with contact',IDS.DB,{contact_id:ct.id},'B-09');
  const t2=await mkTicket('QA AS6 B09 with account only',IDS.DB,{account_id:ac.id},'B-09');
  const t3=await mkTicket('QA AS6 B09 no contact',IDS.DB,{},'B-09');
  await W(6000);
  const g1=await getT(t1.id),g2=await getT(t2.id);
  const res={acct:ac.s+(ac.e||''),contact:ct.s+(ct.e||''),r1:r1.s+(r1.e||''),r2:r2.s+(r2.e||''),t1:{contact:g1.contact_id,account:g1.account_id,owner:nm((await own(t1.id)).owner),s:t1.s,e:t1.e},t2:{account:g2.account_id,owner:nm((await own(t2.id)).owner),s:t2.s,e:t2.e},t3:nm((await own(t3.id)).owner),h1:(await hist(t1.id)).slice(0,2)};
  await setActive(r1.id,false);await setActive(r2.id,false);return res;});
// D-04
await cs('D-04',async()=>{const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
  const p=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,department_threshold_enabled:true,department_threshold:1}));
  const pres=(await api('POST','/desk/agents/presence/query',{user_ids:[IDS.A1]})).j.data.agents[0].presence.online;
  const r=await mkRule({type:'direct',name:'QA AS6 D04 A1 offline',description:'QA',is_active:true,execute_on:['create'],targets:[DT('QA AS6 D04',IDS.DA,null,AG(IDS.A1))]});IDS.DA_D04=r.id;saveIds();
  const t=await mkTicket('QA AS6 D04 offline threshold',IDS.DA,{},'D-04');await W(5000);const w=await own(t.id);
  await setActive(r.id,false);const back=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s;
  LED('D-04: Dept A threshold 1 temporarily, restored; rule deactivated');
  return {pref:p.s,a1Online:pres,rule:r.s,e:r.e,owner:nm(w.owner),h:(await hist(t.id)).slice(0,2),back};});
return RES;
