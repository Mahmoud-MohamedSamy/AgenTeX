const AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b', T='88e8ea44-1658-4df3-9930-d0902b91073d', OWNER='97be04b6-0a08-4883-aa51-e1650b11cab7'; const S=v=>({kind:'string',value:v});
const fl=r=>{const o={id:r.id};for(const x of (r.data||[])){const v=x.value||{};o[x.field]=v.kind==='array'?(v.items||[]).map(i=>i.value):v.value!==undefined?v.value:(v.kind==='null'?null:v);}return o;};
const d=(await api('GET','/desk/departments/'+AO)).j.data; const agents=d.agent_user_ids||[]; const pick=agents.filter(a=>a!==OWNER).slice(0,2);
const out={};
let r=await api('POST','/desk/teams',{name:'QA RT17 2794 team',description:'retest NDC-2794',department_id:AO,sources:pick.map(id=>({kind:'agent',ref_id:id}))});
const team=r.j&&r.j.data&&(r.j.data.id||(r.j.data.team&&r.j.data.team.id)); out.team=SR(r); if(team){I.TM94=team;SAVE();LED('desk team QA RT17 2794 team '+team);}
const SM=(f,op,v)=>({kind:'StringMatch',field:f,operator:op,stringValue:v,caseInsensitive:false}); const base={fieldName:null,dateFieldName:null,offsetSeconds:null,offsetMode:null};
const agent=pick[1]||pick[0];
r=await api('POST','/workflow/rules',{moduleId:T,layoutId:'',name:'QA RT17 2794 team+agent',description:'QA RT17 retest NDC-2794 - safe to delete',mode:'Recurring',isActive:true,trigger:{...base,kind:'RecordCreated'},criteria:{kind:'Logical',operator:'And',operands:[SM('subject','StartsWith','QA RT17 2794')]},actions:[{type:'OwnerAssignment',order:0,delaySeconds:0,ownerTargetKind:'TeamWithAgent',ownerValue:team,ownerAgentId:agent,ownerOnlyOnlineUsers:false}]});
I.W94=r.j&&r.j.data&&r.j.data.id; out.rule=SR(r); if(I.W94){SAVE();LED('desk workflow rule QA RT17 2794 team+agent (ACTIVE) '+I.W94);}
const notIn=agents.find(a=>!pick.includes(a))||OWNER;
r=await api('POST','/workflow/rules',{moduleId:T,layoutId:'',name:'QA RT17 2794 bad agent',description:'QA RT17',mode:'Recurring',isActive:false,trigger:{...base,kind:'RecordCreated'},criteria:{kind:'Logical',operator:'And',operands:[SM('subject','StartsWith','QA RT17 2794 zz')]},actions:[{type:'OwnerAssignment',order:0,delaySeconds:0,ownerTargetKind:'TeamWithAgent',ownerValue:team,ownerAgentId:notIn,ownerOnlyOnlineUsers:false}]});
out.badAgent=SR(r); if(r.j&&r.j.data&&r.j.data.id){LED('desk rule bad agent (should be refused) '+r.j.data.id);}
r=await api('POST','/modules/'+T+'/records',{data:[{field:'subject',value:S('QA RT17 2794 team+agent ticket')},{field:'department',value:S(AO)},{field:'status',value:S('Open')}]});
const id=r.j&&r.j.data&&r.j.data.id; out.ticket=SR(r); if(id){I.TK94=id;SAVE();LED('desk ticket QA RT17 2794 team+agent ticket '+id);}
const snaps=[]; for(const w of [5000,15000,30000]){await sleep(w); const o=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data); snaps.push({after:w,owner:o.owner===agent?'AGENT':o.owner,team:(o.team||o.team_id)===team?'TEAM':(o.team||o.team_id||null)});}
out.snaps=snaps; const act=await api('GET','/desk/tickets/'+id+'/activity'); out.acts=arr(act.j&&act.j.data).map(a=>a.action+' '+JSON.stringify(a.summary||{}).slice(0,160));
out.num=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data).ticket_number;
r=await api('POST','/workflow/rules/'+I.W94+'/deactivate'); out.deact=r.s; LED('desk rule '+I.W94+' deactivated '+r.s);
return out;
