const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b', DA='93949fbd-f9df-4e2e-ae45-00b8dc38385b', CON='349fc131-bdf7-44a3-94b2-78f01eb8d32e';
const IF='l3/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=s=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${s} (Desk, lane 3)\n`);
const E=r=>r.s+' '+(r.s>=300?r.t.slice(0,600):'');
const def={name:'QA RT18 3012 BP',description:'qa rt18 lane3',moduleKey:'desk_tickets',targetField:'status',departmentId:DA,entryCriteria:{op:'contains',field:'subject',value:'QA RT18 3012'},
 states:[{id:'Open',name:'Open',position:{x:80,y:80}},{id:'On Hold',name:'On Hold',position:{x:340,y:80}},{id:'Closed',name:'Closed',position:{x:600,y:80},isTerminal:true}],
 transitions:[{id:'t_qa_1',name:'QA to Hold',fromStateId:'Open',toStateId:'On Hold',before:{allowOwner:true},during:{requiredFields:[{name:'subject',required:true,datatype:{key:'single_line'}}],instructionalMessage:'qa'},after:{actions:[]}},
  {id:'t_qa_2',name:'QA to Close',fromStateId:'On Hold',toStateId:'Closed',before:{allowOwner:true},during:{},after:{actions:[]}}]};
if(!I.BP12){ const c=await api('POST','/modules/'+T+'/blueprints',{definition:def,...def,department_id:DA}); o.create=E(c); const id=c.j&&c.j.data&&c.j.data.id; if(!id) return o; I.BP12=id; SAVE(); LED('blueprint "QA RT18 3012 BP" '+id+' (QA AO Dept A, entry subject contains QA RT18 3012)');
 const p=await api('POST','/modules/'+T+'/blueprints/'+id+'/publish',{}); o.publish=E(p); }
const b=(await api('GET','/modules/'+T+'/blueprints/'+I.BP12)).j.data; o.active=b.isActive; o.dep=b.department_id;
const sv=v=>({kind:'string',value:v});
if(!I.T12){ const c=await api('POST','/modules/'+T+'/records',{layout_id:STD,data:[{field:'subject',value:sv('QA RT18 3012 ticket')},{field:'department',value:sv(DA)},{field:'contact_id',value:sv(CON)},{field:'email',value:sv('qa-rt18-l3@example.com')},{field:'status',value:sv('Open')}]}); o.t=E(c); if(c.j&&c.j.data){I.T12=c.j.data.id;SAVE();LED('ticket "QA RT18 3012 ticket" '+I.T12);} }
await sleep(3000);
for(const p of ['/modules/'+T+'/records/'+I.T12+'/blueprint-transitions','/desk/tickets/'+I.T12+'/blueprint','/desk/tickets/'+I.T12+'/blueprint/transitions']){ const r=await api('GET',p); o['GET '+p.replace(I.T12,':id').replace(T,':T')]=r.s+' '+r.t.slice(0,300); }
return o;
