const T='88e8ea44-1658-4df3-9930-d0902b91073d', L2='6442e84f', DA='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const IF='vr/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=m=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${m} (lane VR)\n`);
const sv=v=>({kind:'string',value:v});
const lay=arr((await api('GET','/modules/'+T+'/layouts')).j.data).find(x=>x.id.startsWith(L2));
if(!I.T13b){ const c=await api('POST','/modules/'+T+'/records',{layout_id:lay.id,data:[{field:'subject',value:sv('QA RT20 VR 3013 ticket other layout')},{field:'department',value:sv(DA)},{field:'status',value:sv('Open')}]}); o.c=c.s+' '+c.t.slice(0,200); if(c.j&&c.j.data){I.T13b=c.j.data.id;SAVE();LED(`ticket "QA RT20 VR 3013 ticket other layout" ${I.T13b} (layout Test Validation Rules, QA AO Dept A, Desk)`);} }
const p=await api('PATCH','/modules/'+T+'/records/'+I.T13b,{data:[{field:'status',value:sv('QA NDC Reject')}]}); o.otherLayoutNoReason=p.s+' '+p.t.slice(0,300);
const q=await api('PATCH','/modules/'+T+'/records/'+I.T13,{data:[{field:'status',value:sv('QA NDC Reject')},{field:'qa_ndc_rejection_reasons',value:sv('QA RT20 VR reason')}]}); o.withReason=q.s+' '+q.t.slice(0,300);
const d=(await api('GET','/modules/'+T+'/records/'+I.T13)).j.data; o.statusNow=((d.data.find(x=>x.field==='status')||{}).value||{}).value;
return o;
