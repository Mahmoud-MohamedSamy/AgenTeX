const T='88e8ea44-1658-4df3-9930-d0902b91073d', AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b', CON='349fc131-bdf7-44a3-94b2-78f01eb8d32e';
const TK='d120a6c2-2596-4254-968b-a1bcd3a000bf', CL='f7e488b5-0232-42fd-811c-1f24356af653', EV='6fb19115-9356-40f0-b064-840d8f1fad93';
const IF='l3/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1));
const LED=s=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${s} (Desk, lane 3)\n`); const o={};
const S=v=>({kind:'string',value:v}); const mk=async(mid,vals,label)=>{const r=await api('POST','/modules/'+mid+'/records',{data:Object.entries(vals).map(([k,v])=>({field:k,value:S(v)}))}); const id=r.j&&r.j.data&&r.j.data.id; if(id) LED(label+' '+id); return {s:r.s,id,e:r.s>=300?r.t.slice(0,300):''};};
const iso=d=>new Date(Date.now()+d*864e5).toISOString();
I.A35=I.A35||{};
if(!I.A35.t){ const r=await mk(T,{subject:'QA RT18 2635 ticket',department:AO,contact_id:CON,email:'qa-rt18-l3@example.com',status:'Open'},'ticket "QA RT18 2635 ticket"'); I.A35.t=r.id; o.t=r; }
if(!I.A35.k1){ const r=await mk(TK,{subject:'QA RT18 2635 task overdue',department:AO,ticket_id:I.A35.t,due_date:iso(-1),status:'Not Started'},'task "QA RT18 2635 task overdue"'); I.A35.k1=r.id; o.k1=r; }
if(!I.A35.k2){ const r=await mk(TK,{subject:'QA RT18 2635 task tomorrow',department:AO,ticket_id:I.A35.t,due_date:iso(1),status:'Not Started'},'task "QA RT18 2635 task tomorrow"'); I.A35.k2=r.id; o.k2=r; }
if(!I.A35.c){ const r=await mk(CL,{subject:'QA RT18 2635 call',department:AO,ticket_id:I.A35.t,contact_id:CON,call_start_time:iso(1),call_status:'Scheduled',call_type:'Outbound'},'call "QA RT18 2635 call"'); I.A35.c=r.id; o.c=r; }
if(!I.A35.e){ const r=await mk(EV,{title:'QA RT18 2635 event',department:AO,ticket_id:I.A35.t,contact_id:CON,from_time:iso(2),to_time:new Date(Date.now()+2*864e5+3600e3).toISOString()},'event "QA RT18 2635 event"'); I.A35.e=r.id; o.e=r; }
SAVE(); o.ids=I.A35; return o;
