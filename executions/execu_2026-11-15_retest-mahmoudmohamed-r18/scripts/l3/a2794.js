const AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b', T='88e8ea44-1658-4df3-9930-d0902b91073d', OWNER='97be04b6-0a08-4883-aa51-e1650b11cab7', CON='349fc131-bdf7-44a3-94b2-78f01eb8d32e'; const S=v=>({kind:'string',value:v});
const IF='l3/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1));
const LED=s=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${s} (Desk, lane 3)\n`); const SR=r=>r.s+(r.s>=300?' '+r.t.slice(0,300):'');
const fl=r=>{const o={id:r.id};for(const x of (r.data||[])){const v=x.value||{};o[x.field]=v.kind==='array'?(v.items||[]).map(i=>i.value):v.value!==undefined?v.value:(v.kind==='null'?null:v);}return o;};
const out={};
const act=arr((await api('GET','/workflow/rules?moduleId='+T)).j?.data).filter(r=>r.isActive).map(r=>r.name+' deps='+JSON.stringify(r.departmentIds)); out.activeRules=act;
const d=(await api('GET','/desk/departments/'+AO)).j.data; const agents=d.agent_user_ids||[]; const pick=agents.filter(a=>a!==OWNER).slice(0,2); out.agents=agents.length+' pick '+pick.length;
if(!I.TM94){ const r=await api('POST','/desk/teams',{name:'QA RT18 2794 team',description:'QA RT18 lane3 retest NDC-2794',department_id:AO,sources:pick.map(id=>({kind:'agent',ref_id:id}))}); const team=r.j&&r.j.data&&(r.j.data.id||(r.j.data.team&&r.j.data.team.id)); out.team=SR(r); if(team){I.TM94=team;SAVE();LED('desk team "QA RT18 2794 team" (QA AO Dept A, 2 agents) '+team);} }
const team=I.TM94; const agent=pick[1]||pick[0]; I.AG94=agent; SAVE();
const SM=(f,op,v)=>({kind:'StringMatch',field:f,operator:op,stringValue:v,caseInsensitive:false}); const base={fieldName:null,dateFieldName:null,offsetSeconds:null,offsetMode:null};
if(!I.W94){ const r=await api('POST','/workflow/rules',{moduleId:T,departmentIds:[AO],name:'QA RT18 2794 team+agent',description:'QA RT18 lane3 retest NDC-2794',mode:'Recurring',isActive:false,trigger:{...base,kind:'RecordCreated'},criteria:{kind:'Logical',operator:'And',operands:[SM('subject','StartsWith','QA RT18 2794')]},actions:[{type:'OwnerAssignment',order:0,delaySeconds:0,ownerTargetKind:'TeamWithAgent',ownerValue:team,ownerAgentId:agent,ownerOnlyOnlineUsers:false}]});
 I.W94=r.j&&r.j.data&&r.j.data.id; out.rule=SR(r); if(I.W94){SAVE();LED('workflow rule "QA RT18 2794 team+agent" (created inactive) '+I.W94);} }
const notIn=agents.find(a=>!pick.includes(a))||OWNER;
const b=await api('POST','/workflow/rules',{moduleId:T,departmentIds:[AO],name:'QA RT18 2794 bad agent',description:'QA RT18',mode:'Recurring',isActive:false,trigger:{...base,kind:'RecordCreated'},criteria:{kind:'Logical',operator:'And',operands:[SM('subject','StartsWith','QA RT18 2794 zz')]},actions:[{type:'OwnerAssignment',order:0,delaySeconds:0,ownerTargetKind:'TeamWithAgent',ownerValue:team,ownerAgentId:notIn,ownerOnlyOnlineUsers:false}]});
out.badAgent=SR(b); if(b.j&&b.j.data&&b.j.data.id) LED('workflow rule bad agent (should be refused, inactive) '+b.j.data.id);
const g=(await api('GET','/workflow/rules/'+I.W94)).j.data; out.saved=JSON.stringify(g.actions).slice(0,300);
let r=await api('POST','/workflow/rules/'+I.W94+'/activate',{}); out.activate=r.s; LED('workflow rule '+I.W94+' activated '+r.s);
r=await api('POST','/modules/'+T+'/records',{data:[{field:'subject',value:S('QA RT18 2794 team+agent ticket')},{field:'department',value:S(AO)},{field:'contact_id',value:S(CON)},{field:'email',value:S('qa-rt18-l3@example.com')},{field:'status',value:S('Open')}]});
const id=r.j&&r.j.data&&r.j.data.id; out.ticket=SR(r); if(id){I.TK94=id;SAVE();LED('ticket "QA RT18 2794 team+agent ticket" '+id);}
const snaps=[]; for(const w of [5000,10000,15000]){await sleep(w); const o=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data); snaps.push({after:w,owner:o.owner===agent?'AGENT':o.owner,team:(o.team||o.team_id)===team?'TEAM':(o.team||o.team_id||null)});}
out.snaps=snaps; const dt=(await api('GET','/desk/tickets/'+id)).j.data||{}; out.deskTicket={team_id:dt.team_id===team?'TEAM':dt.team_id,assignee:dt.assignee_id===agent||dt.owner_id===agent?'AGENT':(dt.assignee_id||dt.owner_id)};
const h=await api('GET','/desk/tickets/'+id+'/history'); out.hist=arr(h.j&&h.j.data).slice(0,8).map(e=>(e.action||'')+' '+(e.field||e.field_name||'')+' '+JSON.stringify(e.old_value)+'→'+JSON.stringify(e.new_value)).map(s=>s.slice(0,160));
const ex=await api('GET','/workflow/executions?recordId='+id); out.exec=arr(ex.j&&ex.j.data).map(e=>(e.ruleName||e.ruleId)+' '+(e.outcome||e.status));
out.num=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data).ticket_number;
r=await api('POST','/workflow/rules/'+I.W94+'/deactivate',{}); out.deact=r.s; LED('workflow rule '+I.W94+' deactivated '+r.s);
return out;
