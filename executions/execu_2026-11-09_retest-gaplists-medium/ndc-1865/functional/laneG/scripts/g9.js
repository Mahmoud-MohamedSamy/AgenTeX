eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/scripts/lib.js','utf8'));
const o={};const BP='/modules/'+T+'/blueprints';
// end F5: deactivate SLA policy
if(IDS.sla){const g=(await api('GET','/desk/sla/policies/'+IDS.sla)).j.data;const r=await api('PUT','/desk/sla/policies/'+IDS.sla,{...g,is_active:false});o.slaOff=r.s;LED('UPDATED SLA policy '+IDS.sla+' deactivated: '+r.s);}
const st=(id,x,extra)=>({id,name:id,position:{x,y:0},slaClock:'business',...(extra||{})});
const def={name:'QA FT 1865 BP',description:'QA NDC-1865 - safe to delete',moduleKey:'desk_tickets',targetField:'status',departmentId:IDS.D,entryCriteria:{op:'contains',field:'subject',value:'QA FT 1865 BP'},
 states:[st('Open',0),st('Closed',300,{isTerminal:true})],
 transitions:[{id:'go',name:'QA FT 1865 Close it',fromStateId:'Open',toStateId:'Closed',before:{},during:{},after:{actions:[]}}]};
if(!IDS.bp){const r=await api('POST',BP,{definition:def,isActive:true});o.create=sh(r);const id=r.j&&r.j.data&&r.j.data.id;if(id){IDS.bp=id;LED('CREATED blueprint "QA FT 1865 BP" '+id);saveIds();}}
await sleep(3000);
const t=await mkTicket('QA FT 1865 BP ticket',{owner:null},'(F7)');IDS.bpTicket=t.id;saveIds();
let s=null;for(let i=0;i<12;i++){await sleep(5000);const r=await api('GET','/modules/'+T+'/records/'+t.id+'/blueprint-state');s=r.j&&r.j.data;if(s&&(s.stateId||s.state_id||s.blueprintId||s.blueprint_id))break;}
o.state=JSON.stringify(s).slice(0,400);
const tr=await api('GET','/modules/'+T+'/records/'+t.id+'/blueprint-transitions');const TL=arr(tr.j&&tr.j.data).length?arr(tr.j.data):(tr.j&&tr.j.data&&(tr.j.data.transitions||tr.j.data.available))||[];o.trans=tr.s+' '+JSON.stringify(TL).slice(0,300);
const go=TL.find(x=>/Close it|go/.test(x.name||x.id||''))||TL[0];
if(go){const cur=(s&&(s.stateId||s.state_id||s.currentStateId||s.current_state_id))||'Open';
 const r=await api('POST','/desk/tickets/'+t.id+'/blueprint-transitions/'+(go.id||go.transitionId),{run_id:require('crypto').randomUUID(),expected_state_id:cur,fields:{},checklist:{},reply:null,comment:null,attachment_ids:[],resolution:null});o.run=sh(r);
 await sleep(4000);const x=await getT(t.id);o.statusAfter=x.status;const s2=await api('GET','/modules/'+T+'/records/'+t.id+'/blueprint-state');o.stateAfter=JSON.stringify(s2.j&&s2.j.data).slice(0,300);}
return o;
