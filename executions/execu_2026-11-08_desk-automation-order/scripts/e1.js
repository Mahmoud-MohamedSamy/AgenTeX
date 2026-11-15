// E2E-1 with the user. PHASE=setup: chain on SUBJECT key in QA AS6 Dept A + Dept A shown in Help Center. Tracked in ../pb-made.json, ids in ../e1.json.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const F='../e1.json';const M=fs.existsSync(F)?JSON.parse(fs.readFileSync(F,'utf8')):{};const save=()=>fs.writeFileSync(F,JSON.stringify(M,null,1));
const c=(f,op,v)=>({field_key:f,operator:op,value:v});const R={};const HC='e74f2abb-e28d-400e-908c-f2c54862e389';
if(process.env.PHASE==='setup'){const k='E1'+U;M.k=k;M.subject='QA AO '+k+' customer journey';save();
 const d=(await api('GET','/desk/departments/'+DA)).j.data;M.visBefore=d.visibility;const vp=await api('PATCH','/desk/departments/'+DA,{name:d.name,display_in_help_center:true});
 const n=(await api('GET','/desk/departments/'+DA)).j.data;R.dept=d.visibility+' -> '+n.visibility+' ('+vp.s+')';R.served=(await api('GET','/help-centers/'+HC+'/served-departments')).j?.data?.department_ids?.includes(DA);save();
 fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' E2E-1: QA AS6 Dept A visibility '+d.visibility+' -> '+n.visibility+' (restore after).\n');
 const sl=(await api('GET','/desk/skills?department_id='+DA)).j?.data;const SL=Array.isArray(sl)?sl:(sl?.skills||[]);const S2=SL.find(s=>s.name==='QA AS6 sk2');
 R.skill=(await api('PUT','/desk/skills/'+S2.id+'?department_id='+DA,{name:S2.name,type_id:S2.type_id,description:S2.description,is_active:true,criteria:{conditions:[c('subject','contains',k)],pattern:null},agent_ids:S2.agent_ids})).s;
 M.wf=await wrule('E1 urgent',{kind:'RecordCreated'},{kind:'StringMatch',field:'subject',operator:'Contains',stringValue:k,caseInsensitive:false},[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'urgent'}}}]);R.wf='ok';
 const tg=(name,conds,r1,r2)=>({name,criteria:{conditions:conds,pattern:conds.length>1?'1 and 2':null},response:{value:r1,unit:'minutes'},resolution:{value:r2,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}});
 const p=await api('POST','/desk/sla/policies',{department_id:DA,name:'QA AO E1 '+U,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:true,
  targets:[tg('urgent 30',[c('subject','contains',k),c('priority','equals','urgent')],30,240),tg('other 300',[c('subject','contains',k)],300,900)]});if(p.j?.data?.id){pbm.sla.push(p.j.data.id);pbSave();M.sla=p.j.data.id;}R.sla=p.s;
 const rr=await prule('round_robin','E1 rr',[{criteria:{conditions:[c('subject','contains',k),c('priority','equals','urgent')],pattern:'1 and 2'},method:'skill',pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}],{on:['create']});M.rr=rr.id;R.rr='ok';
 const st=(id,x={})=>({id,name:id,position:{x:0,y:0},slaClock:'calendar',...x});
 const b=await api('POST','/modules/'+T+'/blueprints',{definition:{name:'QA AO E1 '+U,description:'QA E2E-1 - safe to delete',moduleKey:'desk_tickets',targetField:'status',departmentId:DA,
  entryCriteria:{op:'and',children:[{op:'contains',field:'subject',value:k},{op:'eq',field:'owner',value:A2}]},
  states:[st('Open'),st('On Hold',{onReplyTransitionId:'back'}),st('Closed',{isTerminal:true})],
  transitions:[{id:'ask',name:'Ask customer',fromStateId:'Open',toStateId:'On Hold',before:{allowOwner:true},during:{deskItems:[{kind:'reply',mandatory:true}],itemOrder:['desk:reply']},after:{actions:[]}},
   {id:'back',name:'Customer replied',fromStateId:'On Hold',toStateId:'Open',before:{},during:{},after:{actions:[]}},
   {id:'close',name:'Close',fromStateId:'Open',toStateId:'Closed',before:{allowOwner:true},during:{},after:{actions:[]}}]},isActive:true});
 if(b.j?.data?.id){pbm.bp.push(b.j.data.id);pbSave();M.bp=b.j.data.id;}R.bp=b.s+(b.s>=300?' '+E(b).slice(0,300):'');save();
 R.presence=await presence();R.subject=M.subject;fs.writeFileSync('../e1-setup-result.json',JSON.stringify(R,null,1));return R;}
if(process.env.PHASE==='s3'){const k=M.k;const s=(await api('GET','/modules/'+T+'/records?limit=20&search='+encodeURIComponent(k))).j?.data;const L=Array.isArray(s)?s:(s?.items||s?.records||[]);
 R.found=L.length;if(!L.length)return R;const id=L[0].id;M.t=id;if(!pbm.tickets.includes(id)){pbm.tickets.push(id);pbSave();}
 await sleep(3000);const r=await rec(id);M.num=r.ticket_number;M.contact=r.contact_id||r.contact;save();
 const sa=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;const bs=((await api('GET','/modules/'+T+'/records/'+id+'/blueprint-state')).j?.data?.states||[])[0];
 Object.assign(R,{num:r.ticket_number,channel:r.channel,email:(r.email||'').replace(/^[^+@]+/,'G'),contact:!!M.contact,dept:nm(r.department),skills:await skillsOf(id),priority:r.priority,
  sla:{policy:sa?.policy_name,target:sa?.target_name,obl:(sa?.obligations||[]).map(q=>q.kind+':'+q.state+' due '+(q.due_at||'').slice(11,16)+' UTC')},owner:nm(r.owner),status:r.status,
  blueprint:bs?bs.activeStates:null,execs:await execsOf(id),history:await feedS(id)});
 // A2 bell for this ticket
 const bell=async lab=>{let cur=null,n=0,hits=[];for(let i=0;i<5;i++){const q=(await api('GET','/notifications?limit=100'+(cur?'&cursor='+encodeURIComponent(cur):''),undefined,lab)).j?.data;const it=q?.items||q?.notifications||(Array.isArray(q)?q:[]);for(const x of it){if(JSON.stringify(x).includes(String(r.ticket_number))||JSON.stringify(x).includes(id))hits.push((x.title||x.type||'').slice(0,80));}cur=q?.meta?.next_cursor;if(!cur)break;}return hits;};

 if(M.contact){const iv=await api('POST','/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/invitations/contacts',{contact_ids:[M.contact]});R.invite=iv.s+(iv.s>=300?' '+E(iv).slice(0,200):'');pbm.other=pbm.other||[];pbm.other.push({contact:M.contact});pbSave();}
 save();fs.writeFileSync('../e1-s3-result.json',JSON.stringify(R,null,1));return R;}
